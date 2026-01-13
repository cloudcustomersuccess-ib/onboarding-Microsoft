import React, { useState } from "react";
import { Typography, Alert, List, Space, Tag, Divider, Steps, Form, Input, Select, Switch, Button, Collapse, message } from "antd";
import {
  FileTextOutlined,
  MailOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloudOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { updateField, addNote, submitAwsRegistration } from "@/lib/api";
import { normalizeManufacturer, type ManufacturerKey } from "@/lib/manufacturer";
import { useTrackerTranslations, type Language } from "@/lib/i18n/trackerTranslations";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

type Manufacturer = "MICROSOFT" | "AWS" | "GOOGLE";

interface InstructionContext {
  manufacturer?: Manufacturer | string;
  clienteId?: string;
  organizationName?: string;
  token?: string;
  onFieldUpdated?: () => Promise<void>;
  mirror?: Record<string, any>;
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
        <Title level={5} style={{ marginBottom: 8 }}>
          <CloudOutlined style={{ marginRight: 8 }} />
          {t.substeps.google_cloud_id_group.label}
        </Title>
      </div>

      <Alert
        type="info"
        showIcon
        message={t.substeps.google_cloud_id_group.instructions}
        description={t.substeps.google_cloud_id_group.info_alert}
        style={{ marginBottom: 12 }}
      />

      {isCompleted && (
        <Alert
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
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message={t.substeps.google_cloud_id_group.pending_alert}
          style={{ marginBottom: 12 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Formulario de alta en TD SYNNEX
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Accede al formulario de alta y complétalo con los datos solicitados.
            </Paragraph>
          </div>

          <Alert
            type="info"
            showIcon
            message="Antes de iniciar"
            description="Prepara 1 documento acreditativo del epígrafe/actividad antes de comenzar."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              <FileTextOutlined /> Acción requerida
            </Text>
            <a
              href="https://www.holatdsynnex.com/alta_cliente_td_synnex.html"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14 }}
            >
              Acceder al formulario de alta →
            </a>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Documentos aceptados (uno de los siguientes):
            </Text>
            <List
              size="small"
              dataSource={[
                {
                  title: "IAE (Impuesto de Actividades Económicas)",
                  description:
                    "Copia del último impuesto/recibo de pago donde se vea claramente el epígrafe.",
                },
                {
                  title: "Declaración censal (036)",
                  description:
                    "Copia del modelo 036 donde se vea claramente el epígrafe en el que estás inscrito.",
                },
                {
                  title: "Certificado AEAT",
                  description: "Copia del certificado de revendedor AEAT.",
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

          <Alert
            type="warning"
            showIcon
            icon={<SafetyOutlined />}
            message="Revisión interna"
            description="Una vez enviado el formulario, la solicitud pasará a revisión interna por parte de nuestro equipo."
          />
        </Space>
      );

    // ============================================================
    // Subpaso 1.2 — Confirmación de la cuenta en TD SYNNEX
    // ============================================================
    case "Ecommerce_GK_":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Confirmación de la cuenta en TD SYNNEX
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Tras enviar el formulario, revisamos la solicitud. Dependiendo del resultado, recibirás
              un correo con información adicional o la confirmación de tu cuenta.
            </Paragraph>
          </div>

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Posibles escenarios:
            </Text>
            <List
              size="small"
              dataSource={[
                {
                  icon: <MailOutlined style={{ color: "#1677ff" }} />,
                  title: "Solicitud de información adicional",
                  description:
                    "Si falta algún dato o documento, enviaremos un correo solicitándolo desde altaclientes.es@tdsynnex.com.",
                },
                {
                  icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                  title: "Confirmación de alta",
                  description:
                    "Cuando la cuenta esté creada, enviaremos un correo de confirmación con la información de la cuenta.",
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

          <Alert
            type="info"
            showIcon
            message="Revisa tu bandeja de spam"
            description="Recomendamos revisar la carpeta de spam/no deseado para no perder ninguna comunicación."
          />
        </Space>
      );

    // ============================================================
    // Subpaso 1.3 — Formulario de solicitud de línea de crédito (SEPA B2B)
    // ============================================================
    case "SEPA_B2B_Completado":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Solicitud de línea de crédito (SEPA B2B)
            </Title>
          </div>

          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="Requisito previo"
            description="Este paso se realiza únicamente cuando la cuenta en TD SYNNEX ya está creada."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <List
              size="small"
              bordered
              dataSource={[
                {
                  step: 1,
                  text: "Accede al formulario SEPA B2B",
                  link: "https://www.holatdsynnex.com/sepaB2B.html",
                },
                {
                  step: 2,
                  text: "Inicia sesión con tus credenciales del Área Clientes",
                },
                {
                  step: 3,
                  text: "Completa el formulario con la información solicitada",
                },
                {
                  step: 4,
                  text: 'Recibe por email el PDF "Mandato SEPA B2B"',
                },
                {
                  step: 5,
                  text: "Firma el PDF y adjúntalo en el formulario junto al certificado de titularidad de la cuenta bancaria indicada",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <Tag color="blue">{item.step}</Tag>
                    <Text>
                      {item.text}
                      {item.link && (
                        <>
                          {": "}
                          <a href={item.link} target="_blank" rel="noreferrer">
                            Ir al formulario →
                          </a>
                        </>
                      )}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>

          <Alert
            type="error"
            showIcon
            message="Importante: Firma del mandato SEPA B2B"
            description="Si el mandato SEPA B2B no está firmado y adjuntado, la solicitud puede ser revocada y será necesario repetir el proceso."
          />
        </Space>
      );

    // ============================================================
    // Subpaso 1.4 — Confirmación de asignación de condiciones de crédito
    // ============================================================
    case "RMT_CT_Completado":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Confirmación de condiciones de crédito
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Tras enviar el SEPA B2B con la documentación requerida, el equipo financiero revisa la
              solicitud y asigna las condiciones de crédito correspondientes.
            </Paragraph>
          </div>

          <Alert
            type="info"
            showIcon
            message="Documentación adicional"
            description="Es posible que el equipo financiero solicite documentación adicional para completar la revisión (ejemplos: último impuesto de sociedades, balance oficial, etc.)."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
              Confirmación final
            </Text>
            <Paragraph>
              La confirmación de las condiciones de crédito se comunicará en el mismo hilo de correo del
              proceso de alta, desde Cloud Customer Success.
            </Paragraph>
          </div>
        </Space>
      );

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.1: Alta Microsoft AI Cloud Partner Program
    // ============================================================
    case "Alta_MF_Cloud_AI":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              <CloudOutlined style={{ marginRight: 8 }} />
              Alta en Microsoft AI Cloud Partner Program
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Este alta es necesaria si aún no dispones de Partner Center. Habilita el acceso al Partner
              Center de Microsoft, la plataforma central para gestionar tu relación como partner.
            </Paragraph>
          </div>

          <Alert
            type="info"
            showIcon
            message="Creación del Partner Center"
            description="Este proceso crea o habilita el acceso al Partner Center de Microsoft."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              <LinkOutlined style={{ marginRight: 6 }} />
              Acción requerida
            </Text>
            <a
              href="https://partner.microsoft.com/en-us/dashboard/account/v3/enrollment/introduction/partnership"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14 }}
            >
              Acceder al registro de Partnership →
            </a>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Acceder al enlace de registro",
                  description: "Haz clic en el enlace del Partner Enrollment de Microsoft.",
                },
                {
                  title: 'Seleccionar únicamente la opción "Asóciese"',
                  description: "Del listado de opciones, marca solo 'Asóciese' (Associate/Partnership).",
                },
                {
                  title: "Iniciar sesión con la cuenta profesional de Office 365",
                  description:
                    "Usa tu cuenta corporativa de Office 365. Si no tienes una, crea una nueva cuenta profesional Microsoft.",
                },
                {
                  title: "Seguir el asistente de registro",
                  description: "Completa la información solicitada en el formulario de registro.",
                },
                {
                  title: "Finalizar el registro y comprobar el acceso",
                  description:
                    "Una vez finalizado, la página redirige al Partner Center. Verifica que puedes acceder correctamente.",
                },
              ]}
            />
          </div>

          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="Importante: Cuenta profesional"
            description="Usa una cuenta profesional (tenant corporativo) para evitar incidencias de administración y facturación."
          />
        </Space>
      );

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.2: Alta Cloud Solutions Provider
    // ============================================================
    case "Alta_PAC_MFT":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              <CloudOutlined style={{ marginRight: 8 }} />
              Alta en Cloud Solutions Provider (CSP)
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Esta alta te habilita para operar como revendedor autorizado Microsoft CSP. Requiere tener
              ya Partner Center activo.
            </Paragraph>
          </div>

          <Alert
            type="info"
            showIcon
            message="Requisito previo"
            description="Debes disponer de acceso al Partner Center antes de iniciar este paso."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              <LinkOutlined style={{ marginRight: 6 }} />
              Acción requerida
            </Text>
            <a
              href="https://partner.microsoft.com/en-us/dashboard/account/v3/enrollment/introduction/partnership"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14 }}
            >
              Acceder al registro de Partnership →
            </a>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Acceder al enlace de registro",
                  description: "Haz clic en el enlace del Partner Enrollment.",
                },
                {
                  title: 'Seleccionar la opción "Revender"',
                  description:
                    "Del listado de opciones, marca 'Revender' (o 'Resell' si aparece en inglés).",
                },
                {
                  title: "Iniciar sesión con credenciales del Partner Center",
                  description: "Usa las credenciales de la cuenta que ya tiene acceso al Partner Center.",
                },
                {
                  title: "Seguir el asistente y completar la información",
                  description: "Rellena los datos solicitados en el formulario.",
                },
                {
                  title: "Finalizar y verificar el Partner Center",
                  description: "Comprueba que el Partner Center queda operativo tras el registro.",
                },
              ]}
            />
          </div>

          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="Nota sobre idioma"
            description="Si el portal muestra opciones en inglés, localiza 'Resell' como equivalente a 'Revender'."
          />
        </Space>
      );

    // ============================================================
    // PASO 2 MICROSOFT — Subpaso 2.3: Indirect Reseller Relationship
    // ============================================================
    case "TD_handshake_MFT":
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              <SafetyOutlined style={{ marginRight: 8 }} />
              Indirect Reseller Relationship
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Una vez habilitado como CSP, debes aceptar la invitación para establecer la relación Indirect
              Provider ↔ Indirect Reseller con TD SYNNEX.
            </Paragraph>
          </div>

          <Alert
            type="info"
            showIcon
            message="Paso imprescindible"
            description="Este paso es imprescindible para que TD SYNNEX pueda asociar la cuenta del Partner Center y operar como proveedor indirecto."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              <LinkOutlined style={{ marginRight: 6 }} />
              Acción requerida: Aceptar invitación
            </Text>
            <a
              href="https://admin.microsoft.com/Adminportal/Home?invType=IndirectResellerRelationship&partnerId=df2ef418-7c5b-4ca0-a7c1-8f230e4019da&msppId=6531449&indirectCSPId=75af751c-f582-45e7-aee2-0fd6c8203c1d#/partners/invitation"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14 }}
            >
              Abrir enlace de invitación de TD SYNNEX →
            </a>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Abrir el enlace de invitación",
                  description: "Haz clic en el enlace de invitación de TD SYNNEX.",
                },
                {
                  title: "Iniciar sesión con credenciales del Partner Center",
                  description: "Usa las credenciales de la cuenta con acceso al Partner Center.",
                },
                {
                  title: "Revisar los términos y condiciones",
                  description: "Lee los términos de la asociación Indirect Provider ↔ Indirect Reseller.",
                },
                {
                  title: "Firmar/Aceptar el Indirect Reseller Relationship",
                  description: "Acepta la invitación para establecer la relación indirecta.",
                },
                {
                  title: "Confirmar que la relación queda aceptada",
                  description: "Verifica que la relación con TD SYNNEX queda establecida correctamente.",
                },
              ]}
            />
          </div>

          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="Permisos de administración"
            description="Asegúrate de usar el usuario con permisos de administración en el tenant para completar la aceptación."
          />
        </Space>
      );

    // ============================================================
    // PASO 2 AWS — Subpaso 2.1: Alta en AWS Partner Central
    // ============================================================
    case "AWS Partner Account":
      if (!isManufacturer(context, "AWS")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante AWS."
          />
        );
      }
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Alta en AWS Partner Central
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              En este paso registramos la empresa en AWS Partner Central desde la AWS Console usando una AWS Account. La persona que realice el registro debe tener autoridad legal para aceptar los términos.
            </Paragraph>
          </div>

          <Alert
            type="success"
            showIcon
            message="Si ya dispones de AWS Partner Central"
            description="Si la organización ya dispone de AWS Partner Central, no crees uno nuevo. Marca este paso como completado y confirma en el siguiente paso si ya estás enrolado en un Partner Path."
          />

          <Alert
            type="error"
            showIcon
            message="Requisito previo"
            description="Requisito: disponer de una AWS Account que se usará como cuenta vinculada/designada para Partner Central + acceso a la AWS Console."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Seleccionar la AWS Account",
                  description: "Seleccionar la AWS Account que usará la organización para gestionar Partner Central.",
                },
                {
                  title: "Iniciar sesión en AWS Console",
                  description: "Iniciar sesión en la AWS Console con esa cuenta.",
                },
                {
                  title: "Abrir AWS Partner Central",
                  description: 'En el buscador, abrir "AWS Partner Central" y pulsar "Get started".',
                },
                {
                  title: "Completar verificación de identidad",
                  description: 'Revisar requisitos → "Continue to Registration" → Escanear el QR y completar el flujo (selfie + ID) → "Next" hasta ver "Complete".',
                },
                {
                  title: "Completar verificación de negocio",
                  description: "Completar la verificación de negocio con datos fiscales/legales → revisar → enviar.",
                },
                {
                  title: "Finalizar registro",
                  description: 'Con ambas verificaciones validadas, pulsar "Continue Registration" para finalizar el formulario.',
                },
              ]}
            />
          </div>
        </Space>
      );

    // ============================================================
    // PASO 2 AWS — Subpaso 2.2: Enrólate en un Partner Path
    // ============================================================
    case "AWS_Partner_Engagement":
      if (!isManufacturer(context, "AWS")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante AWS."
          />
        );
      }
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Enrólate en un AWS Partner Path
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Selecciona el tipo de actividad como partner (Services o Software). Más adelante se podrán activar tantos Paths como sea necesario.
            </Paragraph>
          </div>

          <Alert
            type="success"
            showIcon
            message="Si ya estás registrado"
            description="Si la organización ya está registrada en un Partner Path de AWS, marca este paso como completado."
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Explicación de los Partner Paths:
            </Text>
            <Collapse>
              <Panel header="Services Path" key="1">
                <Text>
                  Orientado a consultoría, servicios gestionados y/o reventa de servicios sobre AWS.
                </Text>
              </Panel>
              <Panel header="Software Path" key="2">
                <Text>
                  Orientado a organizaciones que desarrollan software propio basado o integrado con AWS.
                </Text>
              </Panel>
            </Collapse>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Iniciar sesión en AWS Partner Central",
                  description: (
                    <>
                      Acceder a{" "}
                      <a
                        href="https://partnercentral.awspartner.com/partnercentral2/s/login"
                        target="_blank"
                        rel="noreferrer"
                      >
                        AWS Partner Central
                      </a>
                    </>
                  ),
                },
                {
                  title: "Deslizar hasta AWS Partner Paths",
                  description: 'En Home, deslizar hasta la sección "AWS Partner Paths".',
                },
                {
                  title: "Elegir el Path y enrollarse",
                  description: 'Elegir el Path (Services o Software) y pulsar "Enroll".',
                },
                {
                  title: "Revisar y continuar",
                  description: 'Revisar la información y pulsar "Continuar".',
                },
              ]}
            />
          </div>
        </Space>
      );

    // ============================================================
    // PASO 2 AWS — Subpaso 2.3: Completa el AWS Form
    // ============================================================
    case "AWS Form":
      if (!isManufacturer(context, "AWS")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante AWS."
          />
        );
      }
      return <AWSFormComponent context={context} />;

    // ============================================================
    // PASO 2 AWS — Subpaso 2.4: Firma el DSA
    // ============================================================
    case "AWS_DSA":
      if (!isManufacturer(context, "AWS")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante AWS."
          />
        );
      }
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Firma el DSA (Distribution Seller Agreement)
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              El Distribution Seller Agreement (DSA) es el contrato que habilita la reventa a través de TD SYNNEX como distribuidor mayorista autorizado de AWS.
            </Paragraph>
          </div>

          <Alert
            type="success"
            showIcon
            message="Si ya dispones de DSA firmado"
            description="Si la organización ya dispone de un Distribution Seller Agreement firmado con TD SYNNEX en cualquier país de la región EEA, marca este paso como completado."
          />

          <Alert
            type="error"
            showIcon
            message="Firma requerida del Representante Legal"
            description="Una vez el DSA esté firmado por TD SYNNEX y AWS, AWS enviará un email al Representante Legal del AWS Partner Central para firmar vía DocuSign. Sin esa firma, el contrato no es válido."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Acceder a AWS Partner Central",
                  description: (
                    <>
                      Iniciar sesión en{" "}
                      <a
                        href="https://partnercentral.awspartner.com/partnercentral2/s/login"
                        target="_blank"
                        rel="noreferrer"
                      >
                        AWS Partner Central
                      </a>
                    </>
                  ),
                },
                {
                  title: "Ir a Programs → Engagement Requests",
                  description: 'Ir a Programs → "Engagement Requests".',
                },
                {
                  title: "Crear aplicación",
                  description: 'Click en "Create application".',
                },
                {
                  title: "Seleccionar país de transacción",
                  description: "Seleccionar país de transacción (España o Portugal).",
                },
                {
                  title: "Seleccionar TD SYNNEX Corporation",
                  description: 'Seleccionar "TD SYNNEX Corporation".',
                },
                {
                  title: "Cumplimentar información legal",
                  description: "Cumplimentar la información legal → enviar solicitud.",
                },
              ]}
            />
          </div>
        </Space>
      );

    // ============================================================
    // PASO 2 AWS — Subpaso 2.5: AWS Account linking / Marketplace
    // ============================================================
    case "AWS_Marketplace":
      if (!isManufacturer(context, "AWS")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante AWS."
          />
        );
      }
      return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              AWS Account linking (Partner Central ↔ AWS Marketplace)
            </Title>
            <Paragraph style={{ marginBottom: 16 }}>
              Vincula la cuenta de AWS Partner Central con la cuenta de vendedor de AWS Marketplace.
            </Paragraph>
          </div>

          <Alert
            type="error"
            showIcon
            message="Requisito: rol Alliance Lead o Cloud Admin"
            description="Requisito: rol Alliance Lead o Cloud Admin. Durante el flujo se crean/asignan roles IAM estándar (PartnerCentralRoleForCloudAdmin / PartnerCentralRoleForAlliance / PartnerCentralRoleForAce)."
            style={{ marginBottom: 12 }}
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Pasos a seguir:
            </Text>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Iniciar sesión como Alliance Lead o Cloud Administrator",
                  description: "Iniciar sesión en AWS Partner Central como Alliance Lead o Cloud Administrator.",
                },
                {
                  title: "Seleccionar Vincular cuentas",
                  description: 'En Home (arriba derecha) seleccionar "Vincular cuentas".',
                },
                {
                  title: "Iniciar vinculación",
                  description: 'Pulsar "Continuar con la vinculación de la cuenta" y después "Iniciar la vinculación de la cuenta".',
                },
                {
                  title: "Verificar AWS Account ID",
                  description: 'Se abre AWS Console: Verificar AWS Account ID. En "Denominación social legal", escribir razón social. "Siguiente".',
                },
                {
                  title: "Marcar casillas según aplique",
                  description: "Marcar casillas según aplique: Cloud Admin IAM role (PartnerCentralRoleForCloudAdmin-###), Alliance team IAM role (PartnerCentralRoleForAlliance-###), ACE IAM role (PartnerCentralRoleForAce-###).",
                },
                {
                  title: "Vincular cuentas",
                  description: '"Siguiente" → "Vincular cuentas" y verificar confirmación.',
                },
              ]}
            />
          </div>
        </Space>
      );

    // ============================================================
    // PASO 2 GOOGLE — Substep GROUP: Google Cloud ID
    // ============================================================
    case "GOOGLE_CLOUD_ID":
      if (!isManufacturer(context, "GOOGLE")) {
        return (
          <Alert
            type="info"
            showIcon
            message="No aplica"
            description="Este subpaso solo aplica para onboardings con fabricante Google."
          />
        );
      }
      return <GoogleCloudIDForm context={context} />;

    // ============================================================
    // DEFAULT: Subpaso no contemplado
    // ============================================================
    default:
      return (
        <Alert
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
        <Title level={5} style={{ marginBottom: 8 }}>
          Completa el AWS Form
        </Title>
        <Paragraph style={{ marginBottom: 16 }}>
          Este formulario nos permite configurar la relación entre la organización del partner y TD SYNNEX.
        </Paragraph>
      </div>

      {submissionSuccess && submissionId && (
        <Alert
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
