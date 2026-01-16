/**
 * ✅ Función principal que llama api.gs
 */
function saveAwsRegistrationSubmission_(req) {
  const body = req.body || {};
  const data = body.data || {};

  const partnerLegalName = String(data.partnerLegalName || "").trim();
  if (!partnerLegalName) throw new Error("partnerLegalName requerido");

  const submissionId = `AWSFORM-${Utilities.getUuid()}`;
  const createdAt = now_();

  // 1. Guardar en Google Sheets
  const row = [
    submissionId,
    createdAt,
    String(body.userEmail || ""),
    String(body.id || ""),
    partnerLegalName,
    String(data.legalRepName || ""),
    String(data.email || ""),
    String(data.partnerPathType || ""),
    String(data.partnerTier || ""),
    String(data.apnId || ""),
    String(data.solutionProvider || ""),
    String(data.awsCompetency || ""),
    String(data.reservedInstances || ""),
    String(data.dedicatedOrg || ""),
    String(data.customerDedicatedOrg || ""),
    String(data.supportPlan || ""),
    JSON.stringify(data)
  ];

  const sh = getSheet_(CONFIG.SHEETS.AWS_REGISTRATION_SUBMISSIONS);
  sh.appendRow(row);

  // 2. Generar Documento y PDF
  try {
    generateAwsDocument_(data);
  } catch (e) {
    Logger.log("Error generando PDF: " + e.toString());
  }

  return { ok: true, submissionId };
}

/**
 * Lógica de creación de PDF
 */
/**
 * Genera el PDF, lo guarda en Drive y lo envía a Power Automate
 */
function generateAwsDocument_(data) {
  const templateId = CONFIG.PDF.AWS_TEMPLATE_FILE_ID;
  const folderId = CONFIG.PDF.AWS_OUTPUT_FOLDER_ID;
  const folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
  
  // 1. Crear copia y reemplazar textos (Igual que antes)
  const copy = DriveApp.getFileById(templateId).makeCopy(`AWS_Registration_${data.partnerLegalName}`, folder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  const toYesNo = (val) => {
    const s = String(val).toLowerCase();
    return (s === "true" || s === "yes") ? "YES" : "NO";
  };

  body.replaceText('{{partnerName}}', data.partnerLegalName || "");
  body.replaceText('{{legalRep}}', data.legalRepName || "");
  body.replaceText('{{email}}', data.email || "");
  body.replaceText('{{apnId}}', data.apnId || "");
  body.replaceText('{{pathType}}', data.partnerPathType || "");
  body.replaceText('{{tier}}', data.partnerTier || "");
  body.replaceText('{{supportPlan}}', data.supportPlan || "");
  body.replaceText('{{solutionProvider}}', toYesNo(data.solutionProvider));
  body.replaceText('{{competencies}}', toYesNo(data.awsCompetency));
  body.replaceText('{{reservedInstances}}', toYesNo(data.reservedInstances));
  body.replaceText('{{dedicatedOrg}}', toYesNo(data.dedicatedOrg));
  body.replaceText('{{customerOrg}}', toYesNo(data.customerDedicatedOrg));

  doc.saveAndClose();

  // 2. Obtener el Blob del PDF
  const pdfBlob = copy.getAs(MimeType.PDF);
  const pdfFile = folder.createFile(pdfBlob); // Se guarda en Drive
  
  // Limpiar temporal
  copy.setTrashed(true);

  // ---------------------------------------------------------
  // 3. ENVIAR A POWER AUTOMATE
  // ---------------------------------------------------------
  if (CONFIG.POWER_AUTOMATE && CONFIG.POWER_AUTOMATE.AWS_PDF_FLOW_URL) {
    try {
      // Convertimos el archivo a Base64 para poder viajar por internet
      const base64Content = Utilities.base64Encode(pdfBlob.getBytes());
      
      const payload = {
        fileName: pdfFile.getName(),
        fileContent: base64Content, // Aquí va el archivo codificado
        partnerName: data.partnerLegalName,
        email: data.email
      };

      UrlFetchApp.fetch(CONFIG.POWER_AUTOMATE.AWS_PDF_FLOW_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true // Para que no rompa si Power Automate falla
      });
      
      Logger.log("PDF enviado correctamente a Power Automate");
      
    } catch (err) {
      Logger.log("Error enviando a Power Automate (pero el PDF está en Drive): " + err.toString());
      // No lanzamos error para no detener el proceso, ya que el archivo ya está en Drive
    }
  }
}

/**
 * ✅ FUNCIÓN DE TEST (Ejecuta esta desde la consola)
 */
function testAwsSystem() {
  const mockRequest = {
    query: {
      secret: CONFIG.FORMS_SECRET // Esto salta el error Unauthorized
    },
    body: {
      userEmail: "test@empresa.com",
      data: {
        partnerLegalName: "EMPRESA TEST",
        legalRepName: "REPRESENTANTE TEST",
        email: "test@test.com",
        solutionProvider: true,
        awsCompetency: false
      }
    }
  };
  
  const res = saveAwsRegistrationSubmission_(mockRequest);
  Logger.log("Resultado: " + JSON.stringify(res));
}
/**
 * EJECUTA ESTA FUNCIÓN UNA SOLA VEZ
 * Sirve para que Google te pida permisos de DocumentApp explícitamente.
 */
