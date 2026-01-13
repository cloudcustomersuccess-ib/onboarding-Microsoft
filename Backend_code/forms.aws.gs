/**
 * ✅ AWS Registration Form Submission Handler
 *
 * Este handler procesa submissions del formulario AWS Registration.
 * Usa los helpers robustos de db.gs (getSheet_, etc.) en lugar de acceso directo.
 */

function saveAwsRegistrationSubmission_(req) {
  // Validar que tenemos el body con data
  const body = req.body || {};
  const data = body.data || {};

  // Validación de campos requeridos
  const partnerLegalName = String(data.partnerLegalName || "").trim();
  const legalRepName = String(data.legalRepName || "").trim();
  const email = String(data.email || "").trim();

  if (!partnerLegalName) throw new Error("partnerLegalName requerido");
  if (!legalRepName) throw new Error("legalRepName requerido");
  if (!email) throw new Error("email requerido");

  // Generar IDs y timestamps
  const submissionId = `AWSFORM-${Utilities.getUuid()}`;
  const createdAt = now_(); // Usa helper now_() de db.gs

  // Construir fila para insertar
  const row = [
    submissionId,
    createdAt,
    String(body.userEmail || ""),                  // Email del usuario que envía el form (opcional)
    String(body.id || ""),                         // ClienteID (si lo mandas desde UI)
    partnerLegalName,
    legalRepName,
    email,
    String(data.partnerPathType || ""),
    String(data.partnerTier || ""),
    String(data.apnId || ""),
    String(data.solutionProvider || ""),
    String(data.awsCompetency || ""),
    String(data.reservedInstances || ""),
    String(data.dedicatedOrg || ""),
    String(data.customerDedicatedOrg || ""),
    String(data.supportPlan || ""),
    JSON.stringify(data)                           // raw backup JSON
  ];

  // ✅ CRÍTICO: Usa helper getSheet_() que valida CONFIG.SPREADSHEET_ID internamente
  // En lugar de acceder directamente con SpreadsheetApp.openById(CONFIG.SHEET_ID)
  const sh = getSheet_(CONFIG.SHEETS.AWS_REGISTRATION_SUBMISSIONS);

  // Append row
  sh.appendRow(row);

  // Log para debugging (no loguear secrets)
  Logger.log("AWS Form submission saved: %s", submissionId);

  // Opcional: crear audit log
  try {
    auditLog_({
      AuditId: `AUD-${Utilities.getUuid()}`,
      ClienteID: String(body.id || ""),
      FieldKey: "AWS_REGISTRATION_FORM_SUBMIT",
      OldValue: "",
      NewValue: JSON.stringify({ submissionId, email }),
      Action: "FORM_SUBMIT",
      ActorUserId: String(body.userEmail || "ANON"),
      ActorRole: "SYSTEM",
      Source: "UI_FORM",
      Timestamp: createdAt,
      CorrelationId: `CORR-${Utilities.getUuid()}`,
    });
  } catch (auditErr) {
    // No fallar si audit falla
    Logger.log("Audit log failed (non-critical): %s", auditErr);
  }

  return { ok: true, submissionId };
}
