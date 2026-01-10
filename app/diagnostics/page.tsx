"use client";

import { useState } from "react";
import { Card, Button, Typography, Space, Descriptions, Alert } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function DiagnosticsPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const gasBaseUrl =
    process.env.NEXT_PUBLIC_GAS_BASE_URL ||
    "https://script.google.com/macros/s/AKfycbxMIFYo9MEN9C3AE56B184h0dW-CaVzG2-YnN1CoqHhFGfLwa_Ti3EdKuGxP4S4gfLXtQ/exec";
  const useProxy = process.env.NEXT_PUBLIC_USE_GAS_PROXY === "true";

  const testConnection = async () => {
    setTesting(true);
    const testResults: any = {
      config: {
        gasBaseUrl,
        useProxy,
      },
      tests: [],
    };

    try {
      // Test 1: Direct fetch to GAS
      console.log("[Diagnostics] Testing direct connection to GAS...");
      const url = `${gasBaseUrl}?path=/auth/request-otp`;

      testResults.tests.push({
        name: "GAS URL Construction",
        url,
        success: true,
      });

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "test@example.com" }),
        });

        const text = await response.text();

        testResults.tests.push({
          name: "Direct GAS Connection",
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          responseText: text.substring(0, 500),
        });

        try {
          const json = JSON.parse(text);
          testResults.tests.push({
            name: "JSON Parsing",
            success: true,
            parsedData: json,
          });
        } catch (parseError) {
          testResults.tests.push({
            name: "JSON Parsing",
            success: false,
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });
        }
      } catch (fetchError) {
        testResults.tests.push({
          name: "Direct GAS Connection",
          success: false,
          error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        });
      }

      // Test 2: CORS check
      try {
        const corsResponse = await fetch(gasBaseUrl, {
          method: "OPTIONS",
        });

        testResults.tests.push({
          name: "CORS Preflight",
          success: corsResponse.ok,
          status: corsResponse.status,
          headers: Object.fromEntries(corsResponse.headers.entries()),
        });
      } catch (corsError) {
        testResults.tests.push({
          name: "CORS Preflight",
          success: false,
          error: corsError instanceof Error ? corsError.message : String(corsError),
        });
      }

      // Test 3: Proxy endpoint (if enabled)
      if (useProxy) {
        try {
          const proxyResponse = await fetch("/api/gas?path=/auth/request-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "test@example.com" }),
          });

          const proxyText = await proxyResponse.text();

          testResults.tests.push({
            name: "Next.js Proxy",
            success: proxyResponse.ok,
            status: proxyResponse.status,
            responseText: proxyText.substring(0, 500),
          });
        } catch (proxyError) {
          testResults.tests.push({
            name: "Next.js Proxy",
            success: false,
            error: proxyError instanceof Error ? proxyError.message : String(proxyError),
          });
        }
      }

    } catch (error) {
      testResults.error = error instanceof Error ? error.message : String(error);
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Title level={2}>Backend Diagnostics</Title>
          <Paragraph>
            This page helps diagnose connection issues with the Google Apps Script backend.
          </Paragraph>

          <Space>
            <Button
              type="primary"
              onClick={testConnection}
              loading={testing}
              size="large"
            >
              Run Diagnostics
            </Button>
            <Button onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </Space>
        </Card>

        {results && (
          <>
            <Card title="Configuration">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="GAS Base URL">
                  <Text copyable>{results.config.gasBaseUrl}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Use Proxy">
                  {results.config.useProxy ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Test Results">
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {results.tests.map((test: any, index: number) => (
                  <Card
                    key={index}
                    type="inner"
                    title={
                      <Space>
                        {test.success ? (
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        ) : (
                          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                        )}
                        <Text>{test.name}</Text>
                      </Space>
                    }
                  >
                    {test.url && (
                      <Paragraph>
                        <Text strong>URL:</Text> <Text copyable>{test.url}</Text>
                      </Paragraph>
                    )}
                    {test.status !== undefined && (
                      <Paragraph>
                        <Text strong>Status:</Text> {test.status} {test.statusText}
                      </Paragraph>
                    )}
                    {test.error && (
                      <Alert
                        message="Error"
                        description={test.error}
                        type="error"
                        showIcon
                      />
                    )}
                    {test.responseText && (
                      <Paragraph>
                        <Text strong>Response:</Text>
                        <pre style={{
                          background: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "4px",
                          overflow: "auto",
                          maxHeight: "200px"
                        }}>
                          {test.responseText}
                        </pre>
                      </Paragraph>
                    )}
                    {test.parsedData && (
                      <Paragraph>
                        <Text strong>Parsed JSON:</Text>
                        <pre style={{
                          background: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "4px",
                          overflow: "auto"
                        }}>
                          {JSON.stringify(test.parsedData, null, 2)}
                        </pre>
                      </Paragraph>
                    )}
                    {test.headers && (
                      <Paragraph>
                        <Text strong>Headers:</Text>
                        <pre style={{
                          background: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "4px",
                          overflow: "auto",
                          fontSize: "12px"
                        }}>
                          {JSON.stringify(test.headers, null, 2)}
                        </pre>
                      </Paragraph>
                    )}
                  </Card>
                ))}
              </Space>
            </Card>

            {results.error && (
              <Alert
                message="Diagnostics Error"
                description={results.error}
                type="error"
                showIcon
              />
            )}
          </>
        )}
      </Space>
    </div>
  );
}
