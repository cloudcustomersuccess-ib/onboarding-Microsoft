import React, { useState } from "react";
import { Typography, List, Space, Tag, Divider, Form, Input, Select, Switch, Button, Collapse, message } from "antd";
import {
  FileTextOutlined,
  MailOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloudOutlined,
  LinkOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { updateField, addNote, submitAwsRegistration } from "@/lib/api";
import { normalizeManufacturer, type ManufacturerKey } from "@/lib/manufacturer";
import { useTrackerTranslations, type Language } from "@/lib/i18n/trackerTranslations";
import { EmailPushNotification } from "@/components/EmailPushNotification";
import type { Note } from "@/types";
import { CompactAlert } from "./CompactAlert";
import { InstructionSteps } from "./InstructionSteps";
import formStyles from "./TrackerForms.module.css";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;

type Manufacturer = "MICROSOFT" | "AWS" | "GOOGLE";

interface InstructionContext {
  manufacturer?: Manufacturer | string;
  clienteId?: string;
  organizationName?: string;
  token?: string;
  onFieldUpdated?: () => Promise<void>;
  mirror?: Record<string, any>;
  notes?: Note[];
  onboarding?: any;
}

/**
 * Helper to check if the manufacturer matches the expected value
 * Handles normalization to ensure "Amazon Web Services", "AWS", etc. all match
 */
function isManufacturer(context: InstructionContext | undefined, expected: ManufacturerKey): boolean {
  if (!context?.manufacturer) return false;
  const normalized = normalizeManufacturer(context.manufacturer);
  return normalized === expected;
}

/**
 * Helper para obtener el label del programa según manufacturer
 * Para AWS, intenta parsear el Partner Path desde una nota INTERNAL del substep "AWS Form"
 */
function getProgramLabel(context?: InstructionContext): string {
  if (!context?.manufacturer) return "";

  const normalized = normalizeManufacturer(context.manufacturer);

  if (normalized === "MICROSOFT") {
    return "Microsoft CSP";
  }

  if (normalized === "GOOGLE") {
    return "Google Workspace Reseller Program y GCP Reseller Program";
  }

  if (normalized === "AWS") {
    // Intentar deducir el Partner Path desde las notas
    if (context.notes && context.notes.length > 0) {
      // Buscar una nota INTERNAL del substep "AWS Form"
      const awsFormNote = context.notes.find(
        (note) =>
          note.ScopeType === "SUBSTEP" &&
          note.SubstepKey === "AWS Form" &&
          note.Visibility === "INTERNAL"
      );

      if (awsFormNote?.Body) {
        // Parsear el Partner Path desde el body de la nota
        // Formato esperado: "**AWS Partner Path:** Services path" o "**AWS Partner Path:** Software path"
        const match = awsFormNote.Body.match(/\*\*AWS Partner Path:\*\*\s*(Services path|Software path)/i);
        if (match) {
          const partnerPath = match[1].toLowerCase();
          if (partnerPath.includes("services")) {
            return "AWS Solutions Provider";
          } else if (partnerPath.includes("software")) {
            return "AWS Technology Partner Program";
          }
        }
      }
    }

    // Si no se puede determinar, mostrar ambos como opción
    return "AWS Solutions Provider / AWS Technology Partner Program (según tu Partner Path)";
  }

  return "";
}

// ============================================================
// COMPONENTE: Subpaso 1.1 — Formulario de alta en TD SYNNEX
// ============================================================
function AltaHolaTDSynnexContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.alta_hola_tdsynnex.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.alta_hola_tdsynnex.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.alta_hola_tdsynnex.beforeStarting}
        description={t.substeps.alta_hola_tdsynnex.beforeStartingDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          <FileTextOutlined /> {t.substeps.alta_hola_tdsynnex.actionRequired}
        </Text>
        <a
          href="https://www.holatdsynnex.com/alta_cliente_td_synnex.html"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 15 }}
        >
          {t.substeps.alta_hola_tdsynnex.accessForm}
        </a>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.alta_hola_tdsynnex.acceptedDocuments}
        </Text>
        <List
          size="small"
          dataSource={[
            {
              title: t.substeps.alta_hola_tdsynnex.doc1Title,
              description: t.substeps.alta_hola_tdsynnex.doc1Desc,
            },
            {
              title: t.substeps.alta_hola_tdsynnex.doc2Title,
              description: t.substeps.alta_hola_tdsynnex.doc2Desc,
            },
            {
              title: t.substeps.alta_hola_tdsynnex.doc3Title,
              description: t.substeps.alta_hola_tdsynnex.doc3Desc,
            },
          ]}
          renderItem={(item, idx) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Tag color="blue" style={{ marginTop: 4 }}>
                    {idx + 1}
                  </Tag>
                }
                title={<Text strong>{item.title}</Text>}
                description={<Text type="secondary">{item.description}</Text>}
              />
            </List.Item>
          )}
        />
      </div>

      <CompactAlert
        type="warning"
        showIcon
        icon={<SafetyOutlined />}
        message={t.substeps.alta_hola_tdsynnex.internalReview}
        description={t.substeps.alta_hola_tdsynnex.internalReviewDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 1.2 — Confirmación de la cuenta en TD SYNNEX
// ============================================================
function EcommerceGKContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.ecommerce_gk.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.ecommerce_gk.description}
        </Paragraph>
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.ecommerce_gk.possibleScenarios}
        </Text>
        <List
          size="small"
          dataSource={[
            {
              icon: <MailOutlined style={{ color: "#1677ff" }} />,
              title: t.substeps.ecommerce_gk.scenario1Title,
              description: t.substeps.ecommerce_gk.scenario1Desc,
            },
            {
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
              title: t.substeps.ecommerce_gk.scenario2Title,
              description: t.substeps.ecommerce_gk.scenario2Desc,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={<Text strong>{item.title}</Text>}
                description={<Text type="secondary">{item.description}</Text>}
              />
            </List.Item>
          )}
        />
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.ecommerce_gk.checkSpam}
        description={t.substeps.ecommerce_gk.checkSpamDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 1.3 — Solicitud de línea de crédito (SEPA B2B)
// ============================================================
function SepaB2BContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.sepa_b2b_completado.title}
        </Title>
      </div>

      <CompactAlert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={t.substeps.sepa_b2b_completado.prerequisite}
        description={t.substeps.sepa_b2b_completado.prerequisiteDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.sepa_b2b_completado.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            {
              title: t.substeps.sepa_b2b_completado.step1,
              description: (
                <a href="https://www.holatdsynnex.com/sepaB2B.html" target="_blank" rel="noreferrer">
                  {t.substeps.sepa_b2b_completado.step1Link}
                </a>
              ),
            },
            { title: t.substeps.sepa_b2b_completado.step2 },
            { title: t.substeps.sepa_b2b_completado.step3 },
            { title: t.substeps.sepa_b2b_completado.step4 },
            { title: t.substeps.sepa_b2b_completado.step5 },
          ]}
        />
      </div>

      <CompactAlert
        type="error"
        showIcon
        message={t.substeps.sepa_b2b_completado.important}
        description={t.substeps.sepa_b2b_completado.importantDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 1.4 — Confirmación de condiciones de crédito
// ============================================================
function RmtCtContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.rmt_ct_completado.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.rmt_ct_completado.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.rmt_ct_completado.additionalDocs}
        description={t.substeps.rmt_ct_completado.additionalDocsDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
          {t.substeps.rmt_ct_completado.finalConfirmation}
        </Text>
        <Paragraph>
          {t.substeps.rmt_ct_completado.finalConfirmationDesc}
        </Paragraph>
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.1 Microsoft — Alta Microsoft AI Cloud Partner Program
// ============================================================
function AltaMFCloudAIContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          <CloudOutlined style={{ marginRight: 8 }} />
          {t.substeps.alta_mf_cloud_ai.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.alta_mf_cloud_ai.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.alta_mf_cloud_ai.partnerCenterInfo}
        description={t.substeps.alta_mf_cloud_ai.partnerCenterInfoDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          <LinkOutlined style={{ marginRight: 6 }} />
          {t.substeps.alta_mf_cloud_ai.actionRequired}
        </Text>
        <a
          href="https://partner.microsoft.com/en-us/dashboard/account/v3/enrollment/introduction/partnership"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 15 }}
        >
          {t.substeps.alta_mf_cloud_ai.accessLink}
        </a>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.alta_mf_cloud_ai.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.alta_mf_cloud_ai.step1, description: t.substeps.alta_mf_cloud_ai.step1Desc },
            { title: t.substeps.alta_mf_cloud_ai.step2, description: t.substeps.alta_mf_cloud_ai.step2Desc },
            { title: t.substeps.alta_mf_cloud_ai.step3, description: t.substeps.alta_mf_cloud_ai.step3Desc },
            { title: t.substeps.alta_mf_cloud_ai.step4, description: t.substeps.alta_mf_cloud_ai.step4Desc },
            { title: t.substeps.alta_mf_cloud_ai.step5, description: t.substeps.alta_mf_cloud_ai.step5Desc },
          ]}
        />
      </div>

      <CompactAlert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={t.substeps.alta_mf_cloud_ai.professionalAccount}
        description={t.substeps.alta_mf_cloud_ai.professionalAccountDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.2 Microsoft — Alta Cloud Solutions Provider (CSP)
// ============================================================
function AltaPACMFTContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          <CloudOutlined style={{ marginRight: 8 }} />
          {t.substeps.alta_pac_mft.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.alta_pac_mft.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.alta_pac_mft.prerequisite}
        description={t.substeps.alta_pac_mft.prerequisiteDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          <LinkOutlined style={{ marginRight: 6 }} />
          {t.substeps.alta_pac_mft.actionRequired}
        </Text>
        <a
          href="https://partner.microsoft.com/en-us/dashboard/account/v3/enrollment/introduction/partnership"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 15 }}
        >
          {t.substeps.alta_pac_mft.accessLink}
        </a>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.alta_pac_mft.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.alta_pac_mft.step1, description: t.substeps.alta_pac_mft.step1Desc },
            { title: t.substeps.alta_pac_mft.step2, description: t.substeps.alta_pac_mft.step2Desc },
            { title: t.substeps.alta_pac_mft.step3, description: t.substeps.alta_pac_mft.step3Desc },
            { title: t.substeps.alta_pac_mft.step4, description: t.substeps.alta_pac_mft.step4Desc },
            { title: t.substeps.alta_pac_mft.step5, description: t.substeps.alta_pac_mft.step5Desc },
          ]}
        />
      </div>

      <CompactAlert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={t.substeps.alta_pac_mft.languageNote}
        description={t.substeps.alta_pac_mft.languageNoteDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.3 Microsoft — Indirect Reseller Relationship
// ============================================================
function TDHandshakeMFTContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          <SafetyOutlined style={{ marginRight: 8 }} />
          {t.substeps.td_handshake_mft.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.td_handshake_mft.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.td_handshake_mft.essentialStep}
        description={t.substeps.td_handshake_mft.essentialStepDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          <LinkOutlined style={{ marginRight: 6 }} />
          {t.substeps.td_handshake_mft.actionRequired}
        </Text>
        <a
          href="https://admin.microsoft.com/Adminportal/Home?invType=IndirectResellerRelationship&partnerId=df2ef418-7c5b-4ca0-a7c1-8f230e4019da&msppId=6531449&indirectCSPId=75af751c-f582-45e7-aee2-0fd6c8203c1d#/partners/invitation"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 15 }}
        >
          {t.substeps.td_handshake_mft.acceptInvitation}
        </a>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.td_handshake_mft.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.td_handshake_mft.step1, description: t.substeps.td_handshake_mft.step1Desc },
            { title: t.substeps.td_handshake_mft.step2, description: t.substeps.td_handshake_mft.step2Desc },
            { title: t.substeps.td_handshake_mft.step3, description: t.substeps.td_handshake_mft.step3Desc },
            { title: t.substeps.td_handshake_mft.step4, description: t.substeps.td_handshake_mft.step4Desc },
            { title: t.substeps.td_handshake_mft.step5, description: t.substeps.td_handshake_mft.step5Desc },
          ]}
        />
      </div>

      <CompactAlert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message={t.substeps.td_handshake_mft.adminPermissions}
        description={t.substeps.td_handshake_mft.adminPermissionsDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.1 AWS — Alta en AWS Partner Central
// ============================================================
function AWSPartnerAccountContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.aws_partner_account.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.aws_partner_account.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="success"
        showIcon
        message={t.substeps.aws_partner_account.alreadyHaveAccount}
        description={t.substeps.aws_partner_account.alreadyHaveAccountDesc}
      />

      <CompactAlert
        type="error"
        showIcon
        message={t.substeps.aws_partner_account.prerequisite}
        description={t.substeps.aws_partner_account.prerequisiteDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.aws_partner_account.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.aws_partner_account.step1, description: t.substeps.aws_partner_account.step1Desc },
            { title: t.substeps.aws_partner_account.step2, description: t.substeps.aws_partner_account.step2Desc },
            { title: t.substeps.aws_partner_account.step3, description: t.substeps.aws_partner_account.step3Desc },
            { title: t.substeps.aws_partner_account.step4, description: t.substeps.aws_partner_account.step4Desc },
            { title: t.substeps.aws_partner_account.step5, description: t.substeps.aws_partner_account.step5Desc },
            { title: t.substeps.aws_partner_account.step6, description: t.substeps.aws_partner_account.step6Desc },
          ]}
        />
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.2 AWS — Enrólate en un Partner Path
// ============================================================
function AWSPartnerEngagementContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.aws_partner_engagement.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.aws_partner_engagement.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="success"
        showIcon
        message={t.substeps.aws_partner_engagement.alreadyRegistered}
        description={t.substeps.aws_partner_engagement.alreadyRegisteredDesc}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.aws_partner_engagement.pathExplanation}
        </Text>
        <Collapse>
          <Panel header={t.substeps.aws_partner_engagement.servicesPath} key="1">
            <Text>{t.substeps.aws_partner_engagement.servicesPathDesc}</Text>
          </Panel>
          <Panel header={t.substeps.aws_partner_engagement.softwarePath} key="2">
            <Text>{t.substeps.aws_partner_engagement.softwarePathDesc}</Text>
          </Panel>
        </Collapse>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.aws_partner_engagement.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            {
              title: t.substeps.aws_partner_engagement.step1,
              description: (
                <a href="https://partnercentral.awspartner.com/partnercentral2/s/login" target="_blank" rel="noreferrer">
                  {t.substeps.aws_partner_engagement.step1Desc}
                </a>
              ),
            },
            { title: t.substeps.aws_partner_engagement.step2, description: t.substeps.aws_partner_engagement.step2Desc },
            { title: t.substeps.aws_partner_engagement.step3, description: t.substeps.aws_partner_engagement.step3Desc },
            { title: t.substeps.aws_partner_engagement.step4, description: t.substeps.aws_partner_engagement.step4Desc },
          ]}
        />
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.4 AWS — Firma el DSA
// ============================================================
function AWSDSAContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.aws_dsa.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.aws_dsa.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="success"
        showIcon
        message={t.substeps.aws_dsa.alreadyHaveDsa}
        description={t.substeps.aws_dsa.alreadyHaveDsaDesc}
      />

      <CompactAlert
        type="error"
        showIcon
        message={t.substeps.aws_dsa.signatureRequired}
        description={t.substeps.aws_dsa.signatureRequiredDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.aws_dsa.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            {
              title: t.substeps.aws_dsa.step1,
              description: (
                <a href="https://partnercentral.awspartner.com/partnercentral2/s/login" target="_blank" rel="noreferrer">
                  {t.substeps.aws_dsa.step1Desc}
                </a>
              ),
            },
            { title: t.substeps.aws_dsa.step2, description: t.substeps.aws_dsa.step2Desc },
            { title: t.substeps.aws_dsa.step3, description: t.substeps.aws_dsa.step3Desc },
            { title: t.substeps.aws_dsa.step4, description: t.substeps.aws_dsa.step4Desc },
            { title: t.substeps.aws_dsa.step5, description: t.substeps.aws_dsa.step5Desc },
            { title: t.substeps.aws_dsa.step6, description: t.substeps.aws_dsa.step6Desc },
          ]}
        />
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Subpaso 2.5 AWS — AWS Account linking / Marketplace
// ============================================================
function AWSMarketplaceContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.aws_marketplace.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.aws_marketplace.description}
        </Paragraph>
      </div>

      <CompactAlert
        type="error"
        showIcon
        message={t.substeps.aws_marketplace.roleRequirement}
        description={t.substeps.aws_marketplace.roleRequirementDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.aws_marketplace.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.aws_marketplace.step1, description: t.substeps.aws_marketplace.step1Desc },
            { title: t.substeps.aws_marketplace.step2, description: t.substeps.aws_marketplace.step2Desc },
            { title: t.substeps.aws_marketplace.step3, description: t.substeps.aws_marketplace.step3Desc },
            { title: t.substeps.aws_marketplace.step4, description: t.substeps.aws_marketplace.step4Desc },
            { title: t.substeps.aws_marketplace.step5, description: t.substeps.aws_marketplace.step5Desc },
            { title: t.substeps.aws_marketplace.step6, description: t.substeps.aws_marketplace.step6Desc },
          ]}
        />
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Alert para AWS cuando no aplica
// ============================================================
function AWSNotApplicableAlert() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <CompactAlert
      type="info"
      showIcon
      message={t.substeps.aws_partner_account.notApplicable}
      description={t.substeps.aws_partner_account.notApplicableDesc}
    />
  );
}

// ============================================================
// COMPONENTE: Alert para Google cuando no aplica
// ============================================================
function GoogleNotApplicableAlert() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <CompactAlert
      type="info"
      showIcon
      message={t.substeps.google_cloud_id_group.notApplicable}
      description={t.substeps.google_cloud_id_group.notApplicableDesc}
    />
  );
}

// ============================================================
// COMPONENTE AUXILIAR: Google Cloud ID Form (Substep GROUP)
// ============================================================
function GoogleCloudIDForm({ context }: { context?: InstructionContext }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Get language and translations
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  // Get current values from mirror
  const gcId = context?.mirror?.["GC_ID"] ? String(context.mirror["GC_ID"]) : "";
  const domain = context?.mirror?.["Google_Cloud_Domain"] ? String(context.mirror["Google_Cloud_Domain"]) : "";

  // Check if both fields are completed
  const isCompleted = gcId.trim() !== "" && domain.trim() !== "";

  // Initialize form with current values
  React.useEffect(() => {
    form.setFieldsValue({
      gcId: gcId,
      domain: domain,
    });
  }, [form, gcId, domain]);

  const handleSubmit = async (values: any) => {
    if (!context?.token || !context?.clienteId) {
      message.error("Falta token o clienteId. No se puede guardar.");
      return;
    }

    try {
      setSubmitting(true);

      const gcIdTrim = String(values.gcId || "").trim();
      const domainTrim = String(values.domain || "").trim();

      if (!gcIdTrim || !domainTrim) {
        message.error("Ambos campos son obligatorios");
        return;
      }

      // Save both fields sequentially
      await updateField(context.token, context.clienteId, "GC_ID", gcIdTrim);
      await updateField(context.token, context.clienteId, "Google_Cloud_Domain", domainTrim);

      // Refresh the onboarding detail
      if (context.onFieldUpdated) {
        await context.onFieldUpdated();
      }

      message.success(t.substeps.google_cloud_id_group.success_message);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error al guardar los datos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          <CloudOutlined style={{ marginRight: 8 }} />
          {t.substeps.google_cloud_id_group.label}
        </Title>
      </div>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.google_cloud_id_group.instructions}
        description={t.substeps.google_cloud_id_group.info_alert}
        style={{ marginBottom: 12 }}
      />

      {isCompleted && (
        <CompactAlert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message={t.substeps.google_cloud_id_group.completed_alert}
          description={
            <div>
              <Text strong>GC_ID:</Text> {gcId}
              <br />
              <Text strong>{t.substeps.google_cloud_id_group.domain_label}:</Text> {domain}
            </div>
          }
          style={{ marginBottom: 12 }}
        />
      )}

      {!isCompleted && (
        <CompactAlert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message={t.substeps.google_cloud_id_group.pending_alert}
          style={{ marginBottom: 12 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} className={formStyles.formSection}>
        <Form.Item
          label={t.substeps.google_cloud_id_group.gc_id_label}
          name="gcId"
          rules={[
            { required: true, message: "Campo obligatorio" },
            { whitespace: true, message: "No puede estar vacío" },
          ]}
        >
          <Input
            placeholder={t.substeps.google_cloud_id_group.gc_id_placeholder}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={t.substeps.google_cloud_id_group.domain_label}
          name="domain"
          rules={[
            { required: true, message: "Campo obligatorio" },
            { whitespace: true, message: "No puede estar vacío" },
            {
              pattern: /^[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,}$/,
              message: "Formato de dominio inválido (ejemplo: ejemplo.com)",
            },
          ]}
        >
          <Input
            placeholder={t.substeps.google_cloud_id_group.domain_placeholder}
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block size="large">
            {t.substeps.google_cloud_id_group.save_button}
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}

// ============================================================
// COMPONENTE: ION Terms Content (Subpaso 3.1)
// ============================================================
function IONTermsContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.ion_tc_aceptados.title}
        </Title>
      </div>

      <EmailPushNotification
        initials="TS"
        from="no-reply@bryter.io"
        subject="TD SYNNEX - Streamone Ion Platform Agreement Terms - Please Acknowledge"
        timestampLabel={t.substeps.ion_tc_aceptados.emailPreview}
      />

      <Paragraph style={{ marginTop: 8 }}>
        {t.substeps.ion_tc_aceptados.description}
      </Paragraph>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.ion_tc_aceptados.locateEmail}
        description={t.substeps.ion_tc_aceptados.locateEmailDesc}
        style={{ marginBottom: 12 }}
      />

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.ion_tc_aceptados.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            { title: t.substeps.ion_tc_aceptados.step1 },
            { title: t.substeps.ion_tc_aceptados.step2 },
            { title: t.substeps.ion_tc_aceptados.step3 },
            { title: t.substeps.ion_tc_aceptados.step4 },
            { title: t.substeps.ion_tc_aceptados.step5 },
          ]}
        />
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.ion_tc_aceptados.notReceivedTitle}
        </Title>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Space>
            <UserOutlined style={{ color: "#1677ff" }} />
            <Text>{t.substeps.ion_tc_aceptados.contactCSM}</Text>
          </Space>
          <Space>
            <MailOutlined style={{ color: "#1677ff" }} />
            <Link href="mailto:customersuccess.es@tdsynnex.com">
              customersuccess.es@tdsynnex.com
            </Link>
          </Space>
        </Space>
      </div>
    </Space>
  );
}

// ============================================================
// COMPONENTE: Access ION Content (Subpaso 3.2 - Credenciales de acceso)
// ============================================================
function AccessIONContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.access_ion.title}
        </Title>
      </div>

      <EmailPushNotification
        initials="CB"
        from="businessexperiencesu@techdata.com"
        subject="StreamOne® ION Platform Credentials"
        timestampLabel={t.substeps.access_ion.emailPreview}
      />

      <Paragraph style={{ marginTop: 8 }}>
        {t.substeps.access_ion.description1}
      </Paragraph>

      <Paragraph>
        {t.substeps.access_ion.description2}
      </Paragraph>

      <CompactAlert
        type="error"
        showIcon
        message={t.substeps.access_ion.important}
        description={t.substeps.access_ion.importantDesc}
      />
    </Space>
  );
}

// ============================================================
// COMPONENTE: Program Request Content (Subpaso 3.3 - Solicitud de programas)
// ============================================================
function ProgramRequestContent({ context }: { context?: InstructionContext }) {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);
  const programLabel = getProgramLabel(context);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.program_request.title} {programLabel}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.program_request.description}
        </Paragraph>
      </div>

      <div>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          {t.substeps.program_request.stepsTitle}
        </Text>
        <InstructionSteps
          items={[
            {
              title: t.substeps.program_request.step1,
              description: (
                <a href="https://ion.tdsynnex.com/" target="_blank" rel="noreferrer">
                  {t.substeps.program_request.step1Link}
                </a>
              ),
            },
            {
              title: t.substeps.program_request.step2,
            },
            {
              title: t.substeps.program_request.step3,
            },
            {
              title: `${t.substeps.program_request.step4} ${programLabel}.`,
            },
            {
              title: t.substeps.program_request.step5,
            },
          ]}
        />
      </div>

      {isManufacturer(context, "MICROSOFT") && (
        <CompactAlert
          type="error"
          showIcon
          message={t.substeps.program_request.microsoftWarning}
          description={t.substeps.program_request.microsoftWarningDesc}
        />
      )}

      {isManufacturer(context, "GOOGLE") && (
        <CompactAlert
          type="error"
          showIcon
          message={t.substeps.program_request.googleWarning}
          description={t.substeps.program_request.googleWarningDesc}
        />
      )}

      {isManufacturer(context, "AWS") && (
        <CompactAlert
          type="info"
          showIcon
          message={t.substeps.program_request.awsNote}
          description={t.substeps.program_request.awsNoteDesc}
        />
      )}
    </Space>
  );
}

// ============================================================
// COMPONENTE: Onboarding Complete Content (Subpaso 3.4 - Autorización de programas)
// ============================================================
function OnboardingCompleteContent() {
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          {t.substeps.onboarding_complete.title}
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          {t.substeps.onboarding_complete.description}
        </Paragraph>
      </div>

      <Paragraph>
        {t.substeps.onboarding_complete.confirmation}
      </Paragraph>

      <CompactAlert
        type="info"
        showIcon
        message={t.substeps.onboarding_complete.whileReviewing}
        description={t.substeps.onboarding_complete.whileReviewingDesc}
      />
    </Space>
  );
}

/**
 * Devuelve el contenido de instrucciones específico para cada subpaso
 * @param substepKey - La clave del subpaso (key)
 * @param context - Contexto adicional (manufacturer, clienteId, token, etc.)
 * @returns Contenido JSX con instrucciones visuales usando Ant Design
 */
export function getSubstepInstructionContent(
  substepKey: string,
  context?: InstructionContext
): React.ReactNode {
  switch (substepKey) {
    // ============================================================
    // Subpaso 1.1 — Formulario de alta en TD SYNNEX
    // ============================================================
    case "Alta_Hola_TDSynnex_":
      return <AltaHolaTDSynnexContent />;

    // ============================================================
    // Subpaso 1.2 — Confirmación de la cuenta en TD SYNNEX
    // ============================================================
    case "Ecommerce_GK_":
      return <EcommerceGKContent />;

    // ============================================================
    // Subpaso 1.3 — Formulario de solicitud de línea de crédito (SEPA B2B)
    // ============================================================
    case "SEPA_B2B_Completado":
      return <SepaB2BContent />;

    // ============================================================
    // Subpaso 1.4 — Confirmación de asignación de condiciones de crédito
    // ============================================================
    case "RMT_CT_Completado":
      return <RmtCtContent />;

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.1: Alta Microsoft AI Cloud Partner Program
    // ============================================================
    case "Alta_MF_Cloud_AI":
      return <AltaMFCloudAIContent />;

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.2: Alta Cloud Solutions Provider
    // ============================================================
    case "Alta_PAC_MFT":
      return <AltaPACMFTContent />;

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.3: Indirect Reseller Relationship
    // ============================================================
    case "TD_handshake_MFT":
      return <TDHandshakeMFTContent />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.1: Alta en AWS Partner Central
    // ============================================================
    case "AWS Partner Account":
      if (!isManufacturer(context, "AWS")) {
        return <AWSNotApplicableAlert />;
      }
      return <AWSPartnerAccountContent />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.2: Enrólate en un Partner Path
    // ============================================================
    case "AWS_Partner_Engagement":
      if (!isManufacturer(context, "AWS")) {
        return <AWSNotApplicableAlert />;
      }
      return <AWSPartnerEngagementContent />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.3: Completa el AWS Form
    // ============================================================
    case "AWS Form":
      if (!isManufacturer(context, "AWS")) {
        return <AWSNotApplicableAlert />;
      }
      return <AWSFormComponent context={context} />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.4: Firma el DSA
    // ============================================================
    case "AWS_DSA":
      if (!isManufacturer(context, "AWS")) {
        return <AWSNotApplicableAlert />;
      }
      return <AWSDSAContent />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.5: AWS Account linking / Marketplace
    // ============================================================
    case "AWS_Marketplace":
      if (!isManufacturer(context, "AWS")) {
        return <AWSNotApplicableAlert />;
      }
      return <AWSMarketplaceContent />;

    // ============================================================
    // PASO 2 GOOGLE — Substep GROUP: Google Cloud ID
    // ============================================================
    case "GOOGLE_CLOUD_ID":
      if (!isManufacturer(context, "GOOGLE")) {
        return <GoogleNotApplicableAlert />;
      }
      return <GoogleCloudIDForm context={context} />;

    // ============================================================
    // PASO 3 — Subpaso 3.1: Términos y condiciones de StreamOne® ION
    // ============================================================
    case "ION_T&C_aceptados":
      return <IONTermsContent />;

    // ============================================================
    // PASO 3 — Subpaso 3.2: Creación de la cuenta (Credenciales de acceso)
    // ============================================================
    case "Access_ION":
      return <AccessIONContent />;

    // Legacy case for backwards compatibility
    case "Welcome_Email_OPS":
      return <AccessIONContent />;

    // ============================================================
    // PASO 3 — Subpaso 3.3: Solicitud del programa @Manufacturer
    // ============================================================
    case "Program_Request":
      return <ProgramRequestContent context={context} />;

    // ============================================================
    // PASO 3 — Subpaso 3.4: Autorización del programa
    // ============================================================
    case "Onboarding_Complete":
      return <OnboardingCompleteContent />;

    // Legacy case for backwards compatibility
    case "PB_applied":
      return <OnboardingCompleteContent />;

    // ============================================================
    // DEFAULT: Subpaso no contemplado
    // ============================================================
    default:
      return (
        <CompactAlert
          type="info"
          showIcon
          message="Instrucciones no disponibles"
          description={`Las instrucciones para este subpaso (${substepKey}) no están disponibles en este momento.`}
        />
      );
  }
}

// ============================================================
// COMPONENTE AUXILIAR: Formulario AWS Form (Subpaso 2.3)
// ============================================================
function AWSFormComponent({ context }: { context?: InstructionContext }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    if (!context?.token || !context?.clienteId) {
      message.error("Falta token o clienteId. No se puede enviar el formulario.");
      return;
    }

    try {
      setSubmitting(true);

      // Validación campos obligatorios
      const partnerLegalName = String(values.organizationName || "").trim();
      const legalRepName = String(values.legalRepName || "").trim();
      const email = String(values.legalRepEmail || "").trim();

      if (!partnerLegalName) {
        message.error("El nombre legal de la organización es obligatorio");
        return;
      }
      if (!legalRepName) {
        message.error("El nombre del representante legal es obligatorio");
        return;
      }
      if (!email) {
        message.error("El correo del representante legal es obligatorio");
        return;
      }
      // Validación formato email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error("El formato del correo electrónico no es válido");
        return;
      }

      // Obtener el secret desde variables de entorno
      const secret = process.env.NEXT_PUBLIC_AWS_REGISTRATION_SECRET || "";

      // Validar secret antes de enviar
      if (!secret) {
        message.error("AWS Registration Secret no configurado. Contacta al administrador.");
        return;
      }

      // Obtener email del usuario actual (si está disponible)
      const userEmail = context.mirror?.["Email"] || context.organizationName || "";

      // CORRECCIÓN CRÍTICA: Transformar valores según especificación exacta
      const awsFormData = {
        partnerLegalName,
        legalRepName,
        email,
        // partnerPathType: "Services path" o "Software path" (p minúscula)
        partnerPathType: values.partnerPath || "",
        // partnerTier: "Registered" | "Advanced" | "Premier"
        partnerTier: values.partnerTier || "",
        apnId: String(values.apnId || "").trim(),
        // Switches boolean -> "YES" | "NO"
        solutionProvider: values.solutionProvider ? "YES" : "NO",
        reservedInstances: values.hasReservedInstances ? "YES" : "NO",
        dedicatedOrg: values.needsDedicatedOrg ? "YES" : "NO",
        customerDedicatedOrg: values.clientsNeedDedicatedOrg ? "YES" : "NO",
        // hasCertification -> awsCompetency: "Yes" | "No" (Y mayúscula, resto minúscula)
        awsCompetency: values.hasCertification ? "Yes" : "No",
        supportPlan: String(values.supportPlan || "").trim(),
      };

      // Enviar formulario a Apps Script usando helper existente
      const response = await submitAwsRegistration(
        secret,
        context.clienteId,
        String(userEmail),
        awsFormData
      );

      if (!response.ok) {
        throw new Error("Error al guardar el formulario en Apps Script");
      }

      // Guardar submissionId si existe
      if (response.submissionId) {
        setSubmissionId(response.submissionId);
      }

      // Crear nota interna con resumen del formulario
      const summary = `
**AWS Form - Información del Partner**

- **Nombre legal de la organización:** ${partnerLegalName}
- **Representante legal:** ${legalRepName}
- **Correo del representante legal:** ${email}
- **AWS Partner Path:** ${awsFormData.partnerPathType}
- **Partner Tier:** ${awsFormData.partnerTier}
- **APN ID:** ${awsFormData.apnId}
- **Solution provider:** ${awsFormData.solutionProvider}
- **¿Tiene certificación AWS?:** ${awsFormData.awsCompetency}
- **¿Tiene instancias reservadas?:** ${awsFormData.reservedInstances}
- **¿Necesita organización dedicada?:** ${awsFormData.dedicatedOrg}
- **¿Clientes necesitan organización dedicada?:** ${awsFormData.customerDedicatedOrg}
- **Plan de soporte AWS:** ${awsFormData.supportPlan}
${response.submissionId ? `\n- **Submission ID:** ${response.submissionId}` : ""}
      `.trim();

      await addNote(context.token, context.clienteId, {
        scopeType: "SUBSTEP",
        substepKey: "AWS Form",
        visibility: "INTERNAL",
        body: summary,
      });

      // Marcar el subpaso como completado
      await updateField(context.token, context.clienteId, "AWS Form", true);

      // Refrescar el detalle del onboarding
      if (context.onFieldUpdated) {
        await context.onFieldUpdated();
      }

      setSubmissionSuccess(true);
      message.success("Formulario enviado exitosamente a Apps Script");
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Error al enviar el formulario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <div>
        <Title level={5} style={{ marginBottom: 8, fontSize: 17 }}>
          Completa el AWS Form
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          Este formulario nos permite configurar la relación entre la organización del partner y TD SYNNEX.
        </Paragraph>
      </div>

      {submissionSuccess && submissionId && (
        <CompactAlert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="Formulario enviado exitosamente"
          description={
            <div>
              <Text>Tu información ha sido guardada en Google Sheets.</Text>
              <br />
              <Text strong>Submission ID:</Text> <Text code>{submissionId}</Text>
            </div>
          }
          style={{ marginBottom: 12 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={formStyles.formSection}
        initialValues={{
          organizationName: context?.organizationName || "",
          solutionProvider: true,
          hasCertification: false,
          hasReservedInstances: false,
          needsDedicatedOrg: false,
          clientsNeedDedicatedOrg: false,
        }}
      >
        <Form.Item
          label="Nombre legal de la organización"
          name="organizationName"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Nombre legal de la organización" />
        </Form.Item>

        <Form.Item
          label="Nombre del representante legal (en AWS Partner Central)"
          name="legalRepName"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Nombre del representante legal" />
        </Form.Item>

        <Form.Item
          label="Correo del representante legal"
          name="legalRepEmail"
          rules={[
            { required: true, message: "Campo obligatorio" },
            { type: "email", message: "Formato de email no válido" },
          ]}
        >
          <Input placeholder="correo@ejemplo.com" />
        </Form.Item>

        <Form.Item
          label="AWS Partner Path"
          name="partnerPath"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Select placeholder="Selecciona el Partner Path">
            <Select.Option value="Services path">Services path</Select.Option>
            <Select.Option value="Software path">Software path</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Partner Tier"
          name="partnerTier"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Select placeholder="Selecciona el Partner Tier">
            <Select.Option value="Registered">Registered</Select.Option>
            <Select.Option value="Advanced">Advanced</Select.Option>
            <Select.Option value="Premier">Premier</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="APN ID"
          name="apnId"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="APN ID" />
        </Form.Item>

        <Form.Item label="Solution provider" name="solutionProvider" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="¿Tienes alguna certificación de AWS?" name="hasCertification" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="¿Tienes ya desplegadas instancias reservadas?" name="hasReservedInstances" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="¿Necesitas una organización dedicada (Master Payer Account)?" name="needsDedicatedOrg" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="¿Alguno de tus clientes necesita una organización dedicada (Master Payer Account)?" name="clientsNeedDedicatedOrg" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label="¿Tienes contratado un plan de soporte más allá del soporte básico de AWS?"
          name="supportPlan"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Describe tu plan de soporte" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
