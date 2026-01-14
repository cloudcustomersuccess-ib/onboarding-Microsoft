/**
 * Translations for the Onboarding Tracker
 * Supports ES (Spanish), EN (English), PT (Portuguese)
 */

export type Language = "es" | "en" | "pt";

export interface TrackerTranslations {
  // Main steps
  steps: {
    step1: {
      title: string;
    };
    step2: {
      title: string;
      microsoft: string;
      aws: string;
      google: string;
    };
    step3: {
      title: string;
    };
  };

  // Substeps
  substeps: {
    // Step 1
    alta_hola_tdsynnex: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      beforeStarting: string;
      beforeStartingDesc: string;
      actionRequired: string;
      accessForm: string;
      acceptedDocuments: string;
      doc1Title: string;
      doc1Desc: string;
      doc2Title: string;
      doc2Desc: string;
      doc3Title: string;
      doc3Desc: string;
      internalReview: string;
      internalReviewDesc: string;
    };
    ecommerce_gk: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      possibleScenarios: string;
      scenario1Title: string;
      scenario1Desc: string;
      scenario2Title: string;
      scenario2Desc: string;
      checkSpam: string;
      checkSpamDesc: string;
    };
    sepa_b2b_completado: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      prerequisite: string;
      prerequisiteDesc: string;
      stepsTitle: string;
      step1: string;
      step1Link: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      important: string;
      importantDesc: string;
    };
    rmt_ct_completado: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      additionalDocs: string;
      additionalDocsDesc: string;
      finalConfirmation: string;
      finalConfirmationDesc: string;
    };

    // Step 2 - Microsoft
    alta_pac_mft: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      prerequisite: string;
      prerequisiteDesc: string;
      actionRequired: string;
      accessLink: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      languageNote: string;
      languageNoteDesc: string;
    };
    alta_mf_cloud_ai: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      partnerCenterInfo: string;
      partnerCenterInfoDesc: string;
      actionRequired: string;
      accessLink: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      professionalAccount: string;
      professionalAccountDesc: string;
    };
    td_handshake_mft: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      essentialStep: string;
      essentialStepDesc: string;
      actionRequired: string;
      acceptInvitation: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      adminPermissions: string;
      adminPermissionsDesc: string;
    };

    // Step 2 - AWS
    aws_partner_account: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      alreadyHaveAccount: string;
      alreadyHaveAccountDesc: string;
      prerequisite: string;
      prerequisiteDesc: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      step6: string;
      step6Desc: string;
      notApplicable: string;
      notApplicableDesc: string;
    };
    aws_partner_engagement: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      alreadyRegistered: string;
      alreadyRegisteredDesc: string;
      pathExplanation: string;
      servicesPath: string;
      servicesPathDesc: string;
      softwarePath: string;
      softwarePathDesc: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      notApplicable: string;
      notApplicableDesc: string;
    };
    aws_form: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      formSubmittedSuccess: string;
      formSubmittedDesc: string;
      submissionIdLabel: string;
      orgNameLabel: string;
      orgNamePlaceholder: string;
      legalRepLabel: string;
      legalRepPlaceholder: string;
      legalRepEmailLabel: string;
      legalRepEmailPlaceholder: string;
      partnerPathLabel: string;
      partnerPathPlaceholder: string;
      servicesPathOption: string;
      softwarePathOption: string;
      partnerTierLabel: string;
      partnerTierPlaceholder: string;
      apnIdLabel: string;
      apnIdPlaceholder: string;
      solutionProviderLabel: string;
      certificationLabel: string;
      reservedInstancesLabel: string;
      dedicatedOrgLabel: string;
      clientsDedicatedOrgLabel: string;
      supportPlanLabel: string;
      supportPlanPlaceholder: string;
      submitButton: string;
      requiredField: string;
      invalidEmail: string;
      notApplicable: string;
      notApplicableDesc: string;
    };
    aws_dsa: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      alreadyHaveDsa: string;
      alreadyHaveDsaDesc: string;
      signatureRequired: string;
      signatureRequiredDesc: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      step6: string;
      step6Desc: string;
      notApplicable: string;
      notApplicableDesc: string;
    };
    aws_marketplace: {
      label: string;
      instructions: string;
      // Card content
      title: string;
      description: string;
      roleRequirement: string;
      roleRequirementDesc: string;
      stepsTitle: string;
      step1: string;
      step1Desc: string;
      step2: string;
      step2Desc: string;
      step3: string;
      step3Desc: string;
      step4: string;
      step4Desc: string;
      step5: string;
      step5Desc: string;
      step6: string;
      step6Desc: string;
      notApplicable: string;
      notApplicableDesc: string;
    };

    // Step 2 - Google
    gc_id: {
      label: string;
      instructions: string;
    };
    google_cloud_domain: {
      label: string;
      instructions: string;
    };
    google_cloud_id_group: {
      label: string;
      instructions: string;
      gc_id_label: string;
      gc_id_placeholder: string;
      domain_label: string;
      domain_placeholder: string;
      save_button: string;
      completed_alert: string;
      pending_alert: string;
      info_alert: string;
      success_message: string;
      notApplicable: string;
      notApplicableDesc: string;
    };

    // Step 3
    ion_tc_aceptados: {
      label: string;
      instructions: string;
      title: string;
      emailPreview: string;
      description: string;
      locateEmail: string;
      locateEmailDesc: string;
      stepsTitle: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      notReceivedTitle: string;
      contactCSM: string;
    };
    access_ion: {
      label: string;
      instructions: string;
      title: string;
      emailPreview: string;
      description1: string;
      description2: string;
      important: string;
      importantDesc: string;
    };
    program_request: {
      label: string;
      instructions: string;
      title: string;
      description: string;
      stepsTitle: string;
      step1: string;
      step1Link: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      microsoftWarning: string;
      microsoftWarningDesc: string;
      googleWarning: string;
      googleWarningDesc: string;
      awsNote: string;
      awsNoteDesc: string;
    };
    onboarding_complete: {
      label: string;
      instructions: string;
      title: string;
      description: string;
      confirmation: string;
      whileReviewing: string;
      whileReviewingDesc: string;
    };
  };

  // Status labels
  status: {
    completed: string;
    pending: string;
    notStarted: string;
    inProgress: string;
  };

  // UI labels
  ui: {
    generalSteps: string;
    substeps: string;
    timeline: string;
    generalNotes: string;
    overallProgress: string;
    instructions: string;
    addNote: string;
    support: string;
    markComplete: string;
    completedOn: string;
    noNotesYet: string;
    newNote: string;
    save: string;
    cancel: string;
    writeNote: string;
    substepsCompleted: string;
    of: string;
    lockedTooltip: string;
    contactAgent: string;
    noteSaved: string;
    noteError: string;
    deleteNote: string;
    fieldUpdated: string;
    fieldUpdateError: string;
    loadingError: string;
    retry: string;
    tdSynnexWillComplete: string;
  };
}

export const translations: Record<Language, TrackerTranslations> = {
  es: {
    steps: {
      step1: { title: "Paso 1: Configuración Inicial" },
      step2: {
        title: "Paso 2: Configuración del Fabricante",
        microsoft: "Paso 2: Microsoft Partner Center",
        aws: "Paso 2: AWS Partner Central",
        google: "Paso 2: Partner Sales Console (Google)",
      },
      step3: { title: "Paso 3: Finalización" },
    },
    substeps: {
      alta_hola_tdsynnex: {
        label: "Formulario de alta en TD SYNNEX",
        instructions:
          "Completa el registro inicial en la plataforma TDSynnex. Recibirás un email de bienvenida con las instrucciones detalladas.",
        title: "Formulario de alta en TD SYNNEX",
        description: "Accede al formulario de alta y complétalo con los datos solicitados.",
        beforeStarting: "Antes de iniciar",
        beforeStartingDesc: "Prepara 1 documento acreditativo del epígrafe/actividad antes de comenzar.",
        actionRequired: "Acción requerida",
        accessForm: "Acceder al formulario de alta →",
        acceptedDocuments: "Documentos aceptados (uno de los siguientes):",
        doc1Title: "IAE (Impuesto de Actividades Económicas)",
        doc1Desc: "Copia del último impuesto/recibo de pago donde se vea claramente el epígrafe.",
        doc2Title: "Declaración censal (036)",
        doc2Desc: "Copia del modelo 036 donde se vea claramente el epígrafe en el que estás inscrito.",
        doc3Title: "Certificado AEAT",
        doc3Desc: "Copia del certificado de revendedor AEAT.",
        internalReview: "Revisión interna",
        internalReviewDesc: "Una vez enviado el formulario, la solicitud pasará a revisión interna por parte de nuestro equipo.",
      },
      ecommerce_gk: {
        label: "Confirmación de la cuenta en TD SYNNEX",
        instructions:
          "Espera la confirmación de tu cuenta. Recibirás un correo con los detalles de acceso o solicitud de información adicional.",
        title: "Confirmación de la cuenta en TD SYNNEX",
        description: "Tras enviar el formulario, revisamos la solicitud. Dependiendo del resultado, recibirás un correo con información adicional o la confirmación de tu cuenta.",
        possibleScenarios: "Posibles escenarios:",
        scenario1Title: "Solicitud de información adicional",
        scenario1Desc: "Si falta algún dato o documento, enviaremos un correo solicitándolo desde altaclientes.es@tdsynnex.com.",
        scenario2Title: "Confirmación de alta",
        scenario2Desc: "Cuando la cuenta esté creada, enviaremos un correo de confirmación con la información de la cuenta.",
        checkSpam: "Revisa tu bandeja de spam",
        checkSpamDesc: "Recomendamos revisar la carpeta de spam/no deseado para no perder ninguna comunicación.",
      },
      sepa_b2b_completado: {
        label: "Solicitud de línea de crédito (SEPA B2B)",
        instructions:
          "Completa el formulario SEPA B2B para configurar los pagos. Asegúrate de tener los datos bancarios correctos.",
        title: "Solicitud de línea de crédito (SEPA B2B)",
        prerequisite: "Requisito previo",
        prerequisiteDesc: "Este paso se realiza únicamente cuando la cuenta en TD SYNNEX ya está creada.",
        stepsTitle: "Pasos a seguir:",
        step1: "Accede al formulario SEPA B2B",
        step1Link: "Ir al formulario →",
        step2: "Inicia sesión con tus credenciales del Área Clientes",
        step3: "Completa el formulario con la información solicitada",
        step4: "Recibe por email el PDF \"Mandato SEPA B2B\"",
        step5: "Firma el PDF y adjúntalo en el formulario junto al certificado de titularidad de la cuenta bancaria indicada",
        important: "Importante: Firma del mandato SEPA B2B",
        importantDesc: "Si el mandato SEPA B2B no está firmado y adjuntado, la solicitud puede ser revocada y será necesario repetir el proceso.",
      },
      rmt_ct_completado: {
        label: "Confirmación de condiciones de crédito",
        instructions:
          "El equipo financiero revisará tu solicitud y asignará las condiciones de crédito. Recibirás una confirmación por correo.",
        title: "Confirmación de condiciones de crédito",
        description: "Tras enviar el SEPA B2B con la documentación requerida, el equipo financiero revisa la solicitud y asigna las condiciones de crédito correspondientes.",
        additionalDocs: "Documentación adicional",
        additionalDocsDesc: "Es posible que el equipo financiero solicite documentación adicional para completar la revisión (ejemplos: último impuesto de sociedades, balance oficial, etc.).",
        finalConfirmation: "Confirmación final",
        finalConfirmationDesc: "La confirmación de las condiciones de crédito se comunicará en el mismo hilo de correo del proceso de alta, desde Cloud Customer Success.",
      },
      alta_pac_mft: {
        label: "Alta PAC MFT",
        instructions:
          "Registra tu Partner Admin Center (PAC) en Microsoft. Necesitarás tus credenciales de partner de Microsoft.",
        title: "Alta en Cloud Solutions Provider (CSP)",
        description: "Esta alta te habilita para operar como revendedor autorizado Microsoft CSP. Requiere tener ya Partner Center activo.",
        prerequisite: "Requisito previo",
        prerequisiteDesc: "Debes disponer de acceso al Partner Center antes de iniciar este paso.",
        actionRequired: "Acción requerida",
        accessLink: "Acceder al registro de Partnership →",
        stepsTitle: "Pasos a seguir:",
        step1: "Acceder al enlace de registro",
        step1Desc: "Haz clic en el enlace del Partner Enrollment.",
        step2: "Seleccionar la opción \"Revender\"",
        step2Desc: "Del listado de opciones, marca 'Revender' (o 'Resell' si aparece en inglés).",
        step3: "Iniciar sesión con credenciales del Partner Center",
        step3Desc: "Usa las credenciales de la cuenta que ya tiene acceso al Partner Center.",
        step4: "Seguir el asistente y completar la información",
        step4Desc: "Rellena los datos solicitados en el formulario.",
        step5: "Finalizar y verificar el Partner Center",
        step5Desc: "Comprueba que el Partner Center queda operativo tras el registro.",
        languageNote: "Nota sobre idioma",
        languageNoteDesc: "Si el portal muestra opciones en inglés, localiza 'Resell' como equivalente a 'Revender'.",
      },
      alta_mf_cloud_ai: {
        label: "Alta Microsoft Cloud AI",
        instructions:
          "Completa el alta en Microsoft Cloud AI. Esto te permitirá acceder a las herramientas de IA de Microsoft.",
        title: "Alta en Microsoft AI Cloud Partner Program",
        description: "Este alta es necesaria si aún no dispones de Partner Center. Habilita el acceso al Partner Center de Microsoft, la plataforma central para gestionar tu relación como partner.",
        partnerCenterInfo: "Creación del Partner Center",
        partnerCenterInfoDesc: "Este proceso crea o habilita el acceso al Partner Center de Microsoft.",
        actionRequired: "Acción requerida",
        accessLink: "Acceder al registro de Partnership →",
        stepsTitle: "Pasos a seguir:",
        step1: "Acceder al enlace de registro",
        step1Desc: "Haz clic en el enlace del Partner Enrollment de Microsoft.",
        step2: "Seleccionar únicamente la opción \"Asóciese\"",
        step2Desc: "Del listado de opciones, marca solo 'Asóciese' (Associate/Partnership).",
        step3: "Iniciar sesión con la cuenta profesional de Office 365",
        step3Desc: "Usa tu cuenta corporativa de Office 365. Si no tienes una, crea una nueva cuenta profesional Microsoft.",
        step4: "Seguir el asistente de registro",
        step4Desc: "Completa la información solicitada en el formulario de registro.",
        step5: "Finalizar el registro y comprobar el acceso",
        step5Desc: "Una vez finalizado, la página redirige al Partner Center. Verifica que puedes acceder correctamente.",
        professionalAccount: "Importante: Cuenta profesional",
        professionalAccountDesc: "Usa una cuenta profesional (tenant corporativo) para evitar incidencias de administración y facturación.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Realiza el handshake con TD SYNNEX para validar tu configuración de Microsoft.",
        title: "Indirect Reseller Relationship",
        description: "Una vez habilitado como CSP, debes aceptar la invitación para establecer la relación Indirect Provider ↔ Indirect Reseller con TD SYNNEX.",
        essentialStep: "Paso imprescindible",
        essentialStepDesc: "Este paso es imprescindible para que TD SYNNEX pueda asociar la cuenta del Partner Center y operar como proveedor indirecto.",
        actionRequired: "Acción requerida: Aceptar invitación",
        acceptInvitation: "Abrir enlace de invitación de TD SYNNEX →",
        stepsTitle: "Pasos a seguir:",
        step1: "Abrir el enlace de invitación",
        step1Desc: "Haz clic en el enlace de invitación de TD SYNNEX.",
        step2: "Iniciar sesión con credenciales del Partner Center",
        step2Desc: "Usa las credenciales de la cuenta con acceso al Partner Center.",
        step3: "Revisar los términos y condiciones",
        step3Desc: "Lee los términos de la asociación Indirect Provider ↔ Indirect Reseller.",
        step4: "Firmar/Aceptar el Indirect Reseller Relationship",
        step4Desc: "Acepta la invitación para establecer la relación indirecta.",
        step5: "Confirmar que la relación queda aceptada",
        step5Desc: "Verifica que la relación con TD SYNNEX queda establecida correctamente.",
        adminPermissions: "Permisos de administración",
        adminPermissionsDesc: "Asegúrate de usar el usuario con permisos de administración en el tenant para completar la aceptación.",
      },
      aws_partner_account: {
        label: "Alta en AWS Partner Central",
        instructions:
          "Registra la empresa en AWS Partner Central desde la AWS Console. Se requiere una AWS Account y autoridad legal para aceptar términos.",
        title: "Alta en AWS Partner Central",
        description: "En este paso registramos la empresa en AWS Partner Central desde la AWS Console usando una AWS Account. La persona que realice el registro debe tener autoridad legal para aceptar los términos.",
        alreadyHaveAccount: "Si ya dispones de AWS Partner Central",
        alreadyHaveAccountDesc: "Si la organización ya dispone de AWS Partner Central, no crees uno nuevo. Marca este paso como completado y confirma en el siguiente paso si ya estás enrolado en un Partner Path.",
        prerequisite: "Requisito previo",
        prerequisiteDesc: "Requisito: disponer de una AWS Account que se usará como cuenta vinculada/designada para Partner Central + acceso a la AWS Console.",
        stepsTitle: "Pasos a seguir:",
        step1: "Seleccionar la AWS Account",
        step1Desc: "Seleccionar la AWS Account que usará la organización para gestionar Partner Central.",
        step2: "Iniciar sesión en AWS Console",
        step2Desc: "Iniciar sesión en la AWS Console con esa cuenta.",
        step3: "Abrir AWS Partner Central",
        step3Desc: "En el buscador, abrir \"AWS Partner Central\" y pulsar \"Get started\".",
        step4: "Completar verificación de identidad",
        step4Desc: "Revisar requisitos → \"Continue to Registration\" → Escanear el QR y completar el flujo (selfie + ID) → \"Next\" hasta ver \"Complete\".",
        step5: "Completar verificación de negocio",
        step5Desc: "Completar la verificación de negocio con datos fiscales/legales → revisar → enviar.",
        step6: "Finalizar registro",
        step6Desc: "Con ambas verificaciones validadas, pulsar \"Continue Registration\" para finalizar el formulario.",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante AWS.",
      },
      aws_partner_engagement: {
        label: "Enrólate en un Partner Path",
        instructions:
          "Selecciona el tipo de actividad como partner (Services o Software). Este paso habilita el acceso a programas y beneficios de AWS.",
        title: "Enrólate en un AWS Partner Path",
        description: "Selecciona el tipo de actividad como partner (Services o Software). Más adelante se podrán activar tantos Paths como sea necesario.",
        alreadyRegistered: "Si ya estás registrado",
        alreadyRegisteredDesc: "Si la organización ya está registrada en un Partner Path de AWS, marca este paso como completado.",
        pathExplanation: "Explicación de los Partner Paths:",
        servicesPath: "Services Path",
        servicesPathDesc: "Orientado a consultoría, servicios gestionados y/o reventa de servicios sobre AWS.",
        softwarePath: "Software Path",
        softwarePathDesc: "Orientado a organizaciones que desarrollan software propio basado o integrado con AWS.",
        stepsTitle: "Pasos a seguir:",
        step1: "Iniciar sesión en AWS Partner Central",
        step1Desc: "Acceder a AWS Partner Central",
        step2: "Deslizar hasta AWS Partner Paths",
        step2Desc: "En Home, deslizar hasta la sección \"AWS Partner Paths\".",
        step3: "Elegir el Path y enrollarse",
        step3Desc: "Elegir el Path (Services o Software) y pulsar \"Enroll\".",
        step4: "Revisar y continuar",
        step4Desc: "Revisar la información y pulsar \"Continuar\".",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante AWS.",
      },
      aws_form: {
        label: "Completa el AWS Form",
        instructions:
          "Formulario interno para configurar la relación entre el partner y TD SYNNEX como distribuidor.",
        title: "Completa el AWS Form",
        description: "Este formulario nos permite configurar la relación entre la organización del partner y TD SYNNEX.",
        formSubmittedSuccess: "Formulario enviado exitosamente",
        formSubmittedDesc: "Tu información ha sido guardada en Google Sheets.",
        submissionIdLabel: "Submission ID:",
        orgNameLabel: "Nombre legal de la organización",
        orgNamePlaceholder: "Nombre legal de la organización",
        legalRepLabel: "Nombre del representante legal (en AWS Partner Central)",
        legalRepPlaceholder: "Nombre del representante legal",
        legalRepEmailLabel: "Correo del representante legal",
        legalRepEmailPlaceholder: "correo@ejemplo.com",
        partnerPathLabel: "AWS Partner Path",
        partnerPathPlaceholder: "Selecciona el Partner Path",
        servicesPathOption: "Services path",
        softwarePathOption: "Software path",
        partnerTierLabel: "Partner Tier",
        partnerTierPlaceholder: "Selecciona el Partner Tier",
        apnIdLabel: "APN ID",
        apnIdPlaceholder: "APN ID",
        solutionProviderLabel: "Solution provider",
        certificationLabel: "¿Tienes alguna certificación de AWS?",
        reservedInstancesLabel: "¿Tienes ya desplegadas instancias reservadas?",
        dedicatedOrgLabel: "¿Necesitas una organización dedicada (Master Payer Account)?",
        clientsDedicatedOrgLabel: "¿Alguno de tus clientes necesita una organización dedicada (Master Payer Account)?",
        supportPlanLabel: "¿Tienes contratado un plan de soporte más allá del soporte básico de AWS?",
        supportPlanPlaceholder: "Describe tu plan de soporte",
        submitButton: "Enviar",
        requiredField: "Campo obligatorio",
        invalidEmail: "Formato de email no válido",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante AWS.",
      },
      aws_dsa: {
        label: "Firma el DSA",
        instructions:
          "El Distribution Seller Agreement habilita la reventa a través de TD SYNNEX como distribuidor mayorista autorizado de AWS.",
        title: "Firma el DSA (Distribution Seller Agreement)",
        description: "El Distribution Seller Agreement (DSA) es el contrato que habilita la reventa a través de TD SYNNEX como distribuidor mayorista autorizado de AWS.",
        alreadyHaveDsa: "Si ya dispones de DSA firmado",
        alreadyHaveDsaDesc: "Si la organización ya dispone de un Distribution Seller Agreement firmado con TD SYNNEX en cualquier país de la región EEA, marca este paso como completado.",
        signatureRequired: "Firma requerida del Representante Legal",
        signatureRequiredDesc: "Una vez el DSA esté firmado por TD SYNNEX y AWS, AWS enviará un email al Representante Legal del AWS Partner Central para firmar vía DocuSign. Sin esa firma, el contrato no es válido.",
        stepsTitle: "Pasos a seguir:",
        step1: "Acceder a AWS Partner Central",
        step1Desc: "Iniciar sesión en AWS Partner Central",
        step2: "Ir a Programs → Engagement Requests",
        step2Desc: "Ir a Programs → \"Engagement Requests\".",
        step3: "Crear aplicación",
        step3Desc: "Click en \"Create application\".",
        step4: "Seleccionar país de transacción",
        step4Desc: "Seleccionar país de transacción (España o Portugal).",
        step5: "Seleccionar TD SYNNEX Corporation",
        step5Desc: "Seleccionar \"TD SYNNEX Corporation\".",
        step6: "Cumplimentar información legal",
        step6Desc: "Cumplimentar la información legal → enviar solicitud.",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante AWS.",
      },
      aws_marketplace: {
        label: "AWS Account linking / Marketplace",
        instructions:
          "Vincula la cuenta de AWS Partner Central con la cuenta de vendedor de AWS Marketplace.",
        title: "AWS Account linking (Partner Central ↔ AWS Marketplace)",
        description: "Vincula la cuenta de AWS Partner Central con la cuenta de vendedor de AWS Marketplace.",
        roleRequirement: "Requisito: rol Alliance Lead o Cloud Admin",
        roleRequirementDesc: "Requisito: rol Alliance Lead o Cloud Admin. Durante el flujo se crean/asignan roles IAM estándar (PartnerCentralRoleForCloudAdmin / PartnerCentralRoleForAlliance / PartnerCentralRoleForAce).",
        stepsTitle: "Pasos a seguir:",
        step1: "Iniciar sesión como Alliance Lead o Cloud Administrator",
        step1Desc: "Iniciar sesión en AWS Partner Central como Alliance Lead o Cloud Administrator.",
        step2: "Seleccionar Vincular cuentas",
        step2Desc: "En Home (arriba derecha) seleccionar \"Vincular cuentas\".",
        step3: "Iniciar vinculación",
        step3Desc: "Pulsar \"Continuar con la vinculación de la cuenta\" y después \"Iniciar la vinculación de la cuenta\".",
        step4: "Verificar AWS Account ID",
        step4Desc: "Se abre AWS Console: Verificar AWS Account ID. En \"Denominación social legal\", escribir razón social. \"Siguiente\".",
        step5: "Marcar casillas según aplique",
        step5Desc: "Marcar casillas según aplique: Cloud Admin IAM role (PartnerCentralRoleForCloudAdmin-###), Alliance team IAM role (PartnerCentralRoleForAlliance-###), ACE IAM role (PartnerCentralRoleForAce-###).",
        step6: "Vincular cuentas",
        step6Desc: "\"Siguiente\" → \"Vincular cuentas\" y verificar confirmación.",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante AWS.",
      },
      gc_id: {
        label: "Google Cloud ID",
        instructions:
          "Introduce tu Google Cloud ID. Lo encontrarás en la consola de Google Cloud Platform.",
      },
      google_cloud_domain: {
        label: "Google Cloud Domain",
        instructions:
          "Introduce el dominio asociado a tu cuenta de Google Cloud.",
      },
      google_cloud_id_group: {
        label: "Google Cloud ID",
        instructions: "Configura tu identificación de Google Cloud",
        gc_id_label: "Google Cloud ID (GC_ID)",
        gc_id_placeholder: "Introduce tu Google Cloud ID",
        domain_label: "Dominio de Google Cloud",
        domain_placeholder: "ejemplo.com (sin http/https)",
        save_button: "Guardar",
        completed_alert: "Completado: Ambos campos están configurados correctamente.",
        pending_alert: "Pendiente: Completa ambos campos para finalizar el subpaso.",
        info_alert: "Introduce el identificador de Google Cloud (GC_ID) y el dominio principal de la organización. Con estos datos configuramos y validamos el onboarding.",
        success_message: "Datos guardados correctamente",
        notApplicable: "No aplica",
        notApplicableDesc: "Este subpaso solo aplica para onboardings con fabricante Google.",
      },
      ion_tc_aceptados: {
        label: "Condiciones de StreamOne® ION",
        instructions:
          "Acepta los términos y condiciones de StreamOne® ION. Léelos cuidadosamente antes de aceptar.",
        title: "Términos y condiciones de StreamOne® ION",
        emailPreview: "ahora",
        description: "Desde TD SYNNEX hemos enviado los términos y condiciones de StreamOne® ION al correo electrónico indicado para el proceso.",
        locateEmail: "Localiza el email",
        locateEmailDesc: "Localiza un email de no-reply@bryter.io con el asunto: TD SYNNEX - Streamone Ion Platform Agreement Terms - Please Acknowledge.",
        stepsTitle: "Pasos a seguir:",
        step1: "Localiza el email indicado en el buzón.",
        step2: "Abre el enlace https://techdata-legal.bryter....",
        step3: "Revisa la información de la organización (panel izquierdo).",
        step4: "Revisa el contrato de StreamOne® ION (panel derecho).",
        step5: 'Selecciona "Acknowledge" y pulsa "Next" para confirmar los términos.',
        notReceivedTitle: "Si aún no has recibido el contrato de StreamOne® ION...",
        contactCSM: "Contacta con tu Customer Success Manager",
      },
      access_ion: {
        label: "Credenciales de acceso",
        instructions:
          "TD SYNNEX creará tu perfil de partner en StreamOne® ION y generará las credenciales de acceso.",
        title: "Creación de la cuenta",
        emailPreview: "ahora",
        description1: "Desde TD SYNNEX crearemos el perfil de partner en StreamOne® ION y generaremos un único usuario administrador asociado a la persona de contacto indicada en los términos y condiciones del paso anterior.",
        description2: "Tras la creación del usuario, se recibirá un email de Cloud Business Support (businessexperiencesu@techdata.com) con las instrucciones para configurar la contraseña.",
        important: "Importante",
        importantDesc: "Disponer de una cuenta en StreamOne® ION no autoriza a transaccionar en la plataforma. Para ello es necesario solicitar acceso al programa del fabricante en el siguiente paso.",
      },
      program_request: {
        label: "Solicitud de programas",
        instructions:
          "Solicita acceso al programa del fabricante para habilitar la transacción en StreamOne® ION.",
        title: "Solicitud del programa",
        description: "En este paso se solicita el acceso al programa del fabricante para habilitar la transacción en StreamOne® ION.",
        stepsTitle: "Pasos a seguir:",
        step1: "Accede a StreamOne® ION",
        step1Link: "Ir a StreamOne® ION →",
        step2: 'Dirígete a "Partners" en el menú superior.',
        step3: 'Selecciona "Programs" en el menú lateral izquierdo.',
        step4: "Busca y selecciona el programa:",
        step5: 'Pulsa "Request".',
        microsoftWarning: "Importante para Microsoft CSP",
        microsoftWarningDesc: "Al solicitar el programa de Microsoft CSP, introduce el Partner Location Account (antes MPN ID). Se encuentra en Partner Center > Account Settings > Identifiers > CSP. Un PLA incorrecto provoca errores en pedidos desde StreamOne® ION.",
        googleWarning: "Importante para Google",
        googleWarningDesc: "Aunque el workload sea únicamente Google Cloud Platform, es necesario solicitar también Google Workspace Reseller Program además de GCP Reseller Program para poder transaccionar en StreamOne® ION.",
        awsNote: "Nota para AWS",
        awsNoteDesc: "El programa a solicitar depende del Partner Path seleccionado (Services Path → AWS Solutions Provider / Software Path → AWS Technology Partner Program). Asegúrate de seleccionar el programa adecuado.",
      },
      onboarding_complete: {
        label: "Autorización de programas",
        instructions:
          "TD SYNNEX revisará tu solicitud y autorizará el programa. Con esta confirmación, el proceso de alta quedará completado.",
        title: "Autorización del programa",
        description: "TD SYNNEX está revisando la solicitud del programa. Si la configuración en el fabricante es correcta, el programa quedará autorizado en las próximas horas.",
        confirmation: "El Customer Success Manager confirmará la autorización del programa. Con esta confirmación, el proceso de alta en StreamOne® ION quedará completado.",
        whileReviewing: "Mientras el programa esté en revisión",
        whileReviewingDesc: "Mientras el programa esté en revisión, no se podrá transaccionar en StreamOne® ION.",
      },
    },
    status: {
      completed: "Completado",
      pending: "Pendiente",
      notStarted: "No iniciado",
      inProgress: "En proceso",
    },
    ui: {
      generalSteps: "Pasos Principales",
      substeps: "Subpasos",
      timeline: "Línea de Tiempo",
      generalNotes: "Notas Generales",
      overallProgress: "Progreso General",
      instructions: "Instrucciones",
      addNote: "Añadir nota",
      support: "Soporte",
      markComplete: "Marcar como completado",
      completedOn: "Completado el",
      noNotesYet: "Aún no hay notas.",
      newNote: "Nueva nota",
      save: "Guardar",
      cancel: "Cancelar",
      writeNote: "Escribe tu nota...",
      substepsCompleted: "subpasos completados",
      of: "de",
      lockedTooltip: "Se habilita cuando Paso 1 y Paso 2 estén completados",
      contactAgent: "Contactar",
      noteSaved: "Nota guardada",
      noteError: "No se pudo guardar la nota",
      deleteNote: "Eliminar nota",
      fieldUpdated: "Campo actualizado",
      fieldUpdateError: "No se pudo actualizar el campo",
      loadingError: "Error al cargar los datos",
      retry: "Reintentar",
      tdSynnexWillComplete: "TD SYNNEX marcará este paso como completado",
    },
  },

  en: {
    steps: {
      step1: { title: "Step 1: Initial Setup" },
      step2: {
        title: "Step 2: Manufacturer Setup",
        microsoft: "Step 2: Microsoft Partner Center",
        aws: "Step 2: AWS Partner Central",
        google: "Step 2: Partner Sales Console (Google)",
      },
      step3: { title: "Step 3: Finalization" },
    },
    substeps: {
      alta_hola_tdsynnex: {
        label: "TD SYNNEX Registration Form",
        instructions:
          "Complete the initial registration on the TDSynnex platform. You will receive a welcome email with detailed instructions.",
        title: "TD SYNNEX Registration Form",
        description: "Access the registration form and complete it with the requested information.",
        beforeStarting: "Before starting",
        beforeStartingDesc: "Prepare 1 supporting document for your business activity/category before starting.",
        actionRequired: "Action required",
        accessForm: "Access registration form →",
        acceptedDocuments: "Accepted documents (one of the following):",
        doc1Title: "Business Activity Tax (IAE)",
        doc1Desc: "Copy of the latest tax payment/receipt clearly showing the business category.",
        doc2Title: "Census declaration (036)",
        doc2Desc: "Copy of form 036 clearly showing the business category you are registered under.",
        doc3Title: "AEAT Certificate",
        doc3Desc: "Copy of the AEAT reseller certificate.",
        internalReview: "Internal review",
        internalReviewDesc: "Once the form is submitted, the application will undergo internal review by our team.",
      },
      ecommerce_gk: {
        label: "TD SYNNEX Account Confirmation",
        instructions:
          "Wait for your account confirmation. You will receive an email with access details or a request for additional information.",
        title: "TD SYNNEX Account Confirmation",
        description: "After submitting the form, we review the application. Depending on the result, you will receive an email with additional information or confirmation of your account.",
        possibleScenarios: "Possible scenarios:",
        scenario1Title: "Request for additional information",
        scenario1Desc: "If any data or document is missing, we will send an email requesting it from altaclientes.es@tdsynnex.com.",
        scenario2Title: "Registration confirmation",
        scenario2Desc: "When the account is created, we will send a confirmation email with the account information.",
        checkSpam: "Check your spam folder",
        checkSpamDesc: "We recommend checking your spam/junk folder to avoid missing any communications.",
      },
      sepa_b2b_completado: {
        label: "Credit Line Request (SEPA B2B)",
        instructions:
          "Complete the SEPA B2B form to set up payments. Make sure you have the correct bank details.",
        title: "Credit Line Request (SEPA B2B)",
        prerequisite: "Prerequisite",
        prerequisiteDesc: "This step is only performed when the TD SYNNEX account has already been created.",
        stepsTitle: "Steps to follow:",
        step1: "Access the SEPA B2B form",
        step1Link: "Go to form →",
        step2: "Log in with your Customer Area credentials",
        step3: "Complete the form with the requested information",
        step4: "Receive the \"SEPA B2B Mandate\" PDF by email",
        step5: "Sign the PDF and attach it to the form along with the bank account ownership certificate",
        important: "Important: SEPA B2B mandate signature",
        importantDesc: "If the SEPA B2B mandate is not signed and attached, the request may be revoked and the process will need to be repeated.",
      },
      rmt_ct_completado: {
        label: "Credit Conditions Confirmation",
        instructions:
          "The finance team will review your request and assign credit conditions. You will receive email confirmation.",
        title: "Credit Conditions Confirmation",
        description: "After submitting the SEPA B2B with the required documentation, the finance team reviews the request and assigns the corresponding credit conditions.",
        additionalDocs: "Additional documentation",
        additionalDocsDesc: "The finance team may request additional documentation to complete the review (examples: latest corporate tax, official balance sheet, etc.).",
        finalConfirmation: "Final confirmation",
        finalConfirmationDesc: "Confirmation of credit conditions will be communicated in the same email thread of the registration process, from Cloud Customer Success.",
      },
      alta_pac_mft: {
        label: "PAC MFT Registration",
        instructions:
          "Register your Partner Admin Center (PAC) with Microsoft. You will need your Microsoft partner credentials.",
        title: "Cloud Solutions Provider (CSP) Registration",
        description: "This registration enables you to operate as an authorized Microsoft CSP reseller. It requires having an active Partner Center.",
        prerequisite: "Prerequisite",
        prerequisiteDesc: "You must have access to the Partner Center before starting this step.",
        actionRequired: "Action required",
        accessLink: "Access Partnership registration →",
        stepsTitle: "Steps to follow:",
        step1: "Access the registration link",
        step1Desc: "Click on the Partner Enrollment link.",
        step2: "Select the \"Resell\" option",
        step2Desc: "From the list of options, select 'Resell'.",
        step3: "Log in with Partner Center credentials",
        step3Desc: "Use the credentials of the account that already has access to the Partner Center.",
        step4: "Follow the wizard and complete the information",
        step4Desc: "Fill in the requested data in the form.",
        step5: "Finish and verify the Partner Center",
        step5Desc: "Verify that the Partner Center is operational after registration.",
        languageNote: "Language note",
        languageNoteDesc: "If the portal shows options in Spanish, look for 'Revender' as the equivalent of 'Resell'.",
      },
      alta_mf_cloud_ai: {
        label: "Microsoft Cloud AI Registration",
        instructions:
          "Complete the Microsoft Cloud AI registration. This will give you access to Microsoft AI tools.",
        title: "Microsoft AI Cloud Partner Program Registration",
        description: "This registration is required if you don't have a Partner Center yet. It enables access to the Microsoft Partner Center, the central platform for managing your partner relationship.",
        partnerCenterInfo: "Partner Center creation",
        partnerCenterInfoDesc: "This process creates or enables access to the Microsoft Partner Center.",
        actionRequired: "Action required",
        accessLink: "Access Partnership registration →",
        stepsTitle: "Steps to follow:",
        step1: "Access the registration link",
        step1Desc: "Click on the Microsoft Partner Enrollment link.",
        step2: "Select only the \"Associate\" option",
        step2Desc: "From the list of options, select only 'Associate' (Partnership).",
        step3: "Log in with your Office 365 business account",
        step3Desc: "Use your corporate Office 365 account. If you don't have one, create a new Microsoft business account.",
        step4: "Follow the registration wizard",
        step4Desc: "Complete the information requested in the registration form.",
        step5: "Finish registration and verify access",
        step5Desc: "Once completed, the page redirects to the Partner Center. Verify that you can access correctly.",
        professionalAccount: "Important: Business account",
        professionalAccountDesc: "Use a business account (corporate tenant) to avoid administration and billing issues.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Perform the handshake with TD SYNNEX to validate your Microsoft setup.",
        title: "Indirect Reseller Relationship",
        description: "Once enabled as CSP, you must accept the invitation to establish the Indirect Provider ↔ Indirect Reseller relationship with TD SYNNEX.",
        essentialStep: "Essential step",
        essentialStepDesc: "This step is essential for TD SYNNEX to associate the Partner Center account and operate as an indirect provider.",
        actionRequired: "Action required: Accept invitation",
        acceptInvitation: "Open TD SYNNEX invitation link →",
        stepsTitle: "Steps to follow:",
        step1: "Open the invitation link",
        step1Desc: "Click on the TD SYNNEX invitation link.",
        step2: "Log in with Partner Center credentials",
        step2Desc: "Use the credentials of the account with access to the Partner Center.",
        step3: "Review the terms and conditions",
        step3Desc: "Read the terms of the Indirect Provider ↔ Indirect Reseller association.",
        step4: "Sign/Accept the Indirect Reseller Relationship",
        step4Desc: "Accept the invitation to establish the indirect relationship.",
        step5: "Confirm that the relationship is accepted",
        step5Desc: "Verify that the relationship with TD SYNNEX is established correctly.",
        adminPermissions: "Administration permissions",
        adminPermissionsDesc: "Make sure to use the user with administration permissions in the tenant to complete the acceptance.",
      },
      aws_partner_account: {
        label: "AWS Partner Central Registration",
        instructions:
          "Register the company in AWS Partner Central from the AWS Console. An AWS Account is required along with legal authority to accept terms.",
        title: "AWS Partner Central Registration",
        description: "In this step we register the company in AWS Partner Central from the AWS Console using an AWS Account. The person performing the registration must have legal authority to accept the terms.",
        alreadyHaveAccount: "If you already have AWS Partner Central",
        alreadyHaveAccountDesc: "If the organization already has AWS Partner Central, do not create a new one. Mark this step as completed and confirm in the next step if you are already enrolled in a Partner Path.",
        prerequisite: "Prerequisite",
        prerequisiteDesc: "Requirement: have an AWS Account that will be used as the linked/designated account for Partner Central + access to the AWS Console.",
        stepsTitle: "Steps to follow:",
        step1: "Select the AWS Account",
        step1Desc: "Select the AWS Account that the organization will use to manage Partner Central.",
        step2: "Log in to AWS Console",
        step2Desc: "Log in to the AWS Console with that account.",
        step3: "Open AWS Partner Central",
        step3Desc: "In the search bar, open \"AWS Partner Central\" and click \"Get started\".",
        step4: "Complete identity verification",
        step4Desc: "Review requirements → \"Continue to Registration\" → Scan the QR and complete the flow (selfie + ID) → \"Next\" until you see \"Complete\".",
        step5: "Complete business verification",
        step5Desc: "Complete business verification with tax/legal data → review → submit.",
        step6: "Finish registration",
        step6Desc: "With both verifications validated, click \"Continue Registration\" to finish the form.",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with AWS manufacturer.",
      },
      aws_partner_engagement: {
        label: "Enroll in a Partner Path",
        instructions:
          "Select the type of partner activity (Services or Software). This step enables access to AWS programs and benefits.",
        title: "Enroll in an AWS Partner Path",
        description: "Select the type of partner activity (Services or Software). Additional Paths can be activated later as needed.",
        alreadyRegistered: "If you are already registered",
        alreadyRegisteredDesc: "If the organization is already registered in an AWS Partner Path, mark this step as completed.",
        pathExplanation: "Partner Paths explanation:",
        servicesPath: "Services Path",
        servicesPathDesc: "Oriented towards consulting, managed services and/or resale of services on AWS.",
        softwarePath: "Software Path",
        softwarePathDesc: "Oriented towards organizations that develop their own software based on or integrated with AWS.",
        stepsTitle: "Steps to follow:",
        step1: "Log in to AWS Partner Central",
        step1Desc: "Access AWS Partner Central",
        step2: "Scroll to AWS Partner Paths",
        step2Desc: "On Home, scroll to the \"AWS Partner Paths\" section.",
        step3: "Choose the Path and enroll",
        step3Desc: "Choose the Path (Services or Software) and click \"Enroll\".",
        step4: "Review and continue",
        step4Desc: "Review the information and click \"Continue\".",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with AWS manufacturer.",
      },
      aws_form: {
        label: "Complete AWS Form",
        instructions:
          "Internal form to configure the relationship between the partner and TD SYNNEX as a distributor.",
        title: "Complete AWS Form",
        description: "This form allows us to configure the relationship between the partner organization and TD SYNNEX.",
        formSubmittedSuccess: "Form submitted successfully",
        formSubmittedDesc: "Your information has been saved to Google Sheets.",
        submissionIdLabel: "Submission ID:",
        orgNameLabel: "Legal name of the organization",
        orgNamePlaceholder: "Legal name of the organization",
        legalRepLabel: "Legal representative name (in AWS Partner Central)",
        legalRepPlaceholder: "Legal representative name",
        legalRepEmailLabel: "Legal representative email",
        legalRepEmailPlaceholder: "email@example.com",
        partnerPathLabel: "AWS Partner Path",
        partnerPathPlaceholder: "Select Partner Path",
        servicesPathOption: "Services path",
        softwarePathOption: "Software path",
        partnerTierLabel: "Partner Tier",
        partnerTierPlaceholder: "Select Partner Tier",
        apnIdLabel: "APN ID",
        apnIdPlaceholder: "APN ID",
        solutionProviderLabel: "Solution provider",
        certificationLabel: "Do you have any AWS certification?",
        reservedInstancesLabel: "Do you already have reserved instances deployed?",
        dedicatedOrgLabel: "Do you need a dedicated organization (Master Payer Account)?",
        clientsDedicatedOrgLabel: "Do any of your clients need a dedicated organization (Master Payer Account)?",
        supportPlanLabel: "Do you have a support plan beyond AWS basic support?",
        supportPlanPlaceholder: "Describe your support plan",
        submitButton: "Submit",
        requiredField: "Required field",
        invalidEmail: "Invalid email format",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with AWS manufacturer.",
      },
      aws_dsa: {
        label: "Sign the DSA",
        instructions:
          "The Distribution Seller Agreement enables resale through TD SYNNEX as an authorized AWS wholesale distributor.",
        title: "Sign the DSA (Distribution Seller Agreement)",
        description: "The Distribution Seller Agreement (DSA) is the contract that enables resale through TD SYNNEX as an authorized AWS wholesale distributor.",
        alreadyHaveDsa: "If you already have a signed DSA",
        alreadyHaveDsaDesc: "If the organization already has a Distribution Seller Agreement signed with TD SYNNEX in any EEA country, mark this step as completed.",
        signatureRequired: "Legal Representative signature required",
        signatureRequiredDesc: "Once the DSA is signed by TD SYNNEX and AWS, AWS will send an email to the Legal Representative of AWS Partner Central to sign via DocuSign. Without that signature, the contract is not valid.",
        stepsTitle: "Steps to follow:",
        step1: "Access AWS Partner Central",
        step1Desc: "Log in to AWS Partner Central",
        step2: "Go to Programs → Engagement Requests",
        step2Desc: "Go to Programs → \"Engagement Requests\".",
        step3: "Create application",
        step3Desc: "Click on \"Create application\".",
        step4: "Select transaction country",
        step4Desc: "Select transaction country (Spain or Portugal).",
        step5: "Select TD SYNNEX Corporation",
        step5Desc: "Select \"TD SYNNEX Corporation\".",
        step6: "Complete legal information",
        step6Desc: "Complete the legal information → submit request.",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with AWS manufacturer.",
      },
      aws_marketplace: {
        label: "AWS Account Linking / Marketplace",
        instructions:
          "Link the AWS Partner Central account with the AWS Marketplace seller account.",
        title: "AWS Account linking (Partner Central ↔ AWS Marketplace)",
        description: "Link the AWS Partner Central account with the AWS Marketplace seller account.",
        roleRequirement: "Requirement: Alliance Lead or Cloud Admin role",
        roleRequirementDesc: "Requirement: Alliance Lead or Cloud Admin role. During the flow, standard IAM roles are created/assigned (PartnerCentralRoleForCloudAdmin / PartnerCentralRoleForAlliance / PartnerCentralRoleForAce).",
        stepsTitle: "Steps to follow:",
        step1: "Log in as Alliance Lead or Cloud Administrator",
        step1Desc: "Log in to AWS Partner Central as Alliance Lead or Cloud Administrator.",
        step2: "Select Link accounts",
        step2Desc: "On Home (top right) select \"Link accounts\".",
        step3: "Start linking",
        step3Desc: "Click \"Continue with account linking\" and then \"Start account linking\".",
        step4: "Verify AWS Account ID",
        step4Desc: "AWS Console opens: Verify AWS Account ID. In \"Legal company name\", enter company name. \"Next\".",
        step5: "Check boxes as applicable",
        step5Desc: "Check boxes as applicable: Cloud Admin IAM role (PartnerCentralRoleForCloudAdmin-###), Alliance team IAM role (PartnerCentralRoleForAlliance-###), ACE IAM role (PartnerCentralRoleForAce-###).",
        step6: "Link accounts",
        step6Desc: "\"Next\" → \"Link accounts\" and verify confirmation.",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with AWS manufacturer.",
      },
      gc_id: {
        label: "Google Cloud ID",
        instructions:
          "Enter your Google Cloud ID. You can find it in the Google Cloud Platform console.",
      },
      google_cloud_domain: {
        label: "Google Cloud Domain",
        instructions:
          "Enter the domain associated with your Google Cloud account.",
      },
      google_cloud_id_group: {
        label: "Google Cloud ID",
        instructions: "Configure your Google Cloud identification",
        gc_id_label: "Google Cloud ID (GC_ID)",
        gc_id_placeholder: "Enter your Google Cloud ID",
        domain_label: "Google Cloud Domain",
        domain_placeholder: "example.com (without http/https)",
        save_button: "Save",
        completed_alert: "Completed: Both fields are correctly configured.",
        pending_alert: "Pending: Complete both fields to finish this substep.",
        info_alert: "Enter the Google Cloud identifier (GC_ID) and the organization's primary domain. This data is used to configure and validate the onboarding.",
        success_message: "Data saved successfully",
        notApplicable: "Not applicable",
        notApplicableDesc: "This substep only applies to onboardings with Google manufacturer.",
      },
      ion_tc_aceptados: {
        label: "StreamOne® ION Terms",
        instructions:
          "Accept the StreamOne® ION terms and conditions. Read them carefully before accepting.",
        title: "StreamOne® ION Terms and Conditions",
        emailPreview: "now",
        description: "TD SYNNEX has sent the StreamOne® ION terms and conditions to the email address provided for the process.",
        locateEmail: "Locate the email",
        locateEmailDesc: "Locate an email from no-reply@bryter.io with the subject: TD SYNNEX - Streamone Ion Platform Agreement Terms - Please Acknowledge.",
        stepsTitle: "Steps to follow:",
        step1: "Locate the indicated email in your inbox.",
        step2: "Open the link https://techdata-legal.bryter....",
        step3: "Review the organization information (left panel).",
        step4: "Review the StreamOne® ION contract (right panel).",
        step5: 'Select "Acknowledge" and click "Next" to confirm the terms.',
        notReceivedTitle: "If you haven't received the StreamOne® ION contract yet...",
        contactCSM: "Contact your Customer Success Manager",
      },
      access_ion: {
        label: "Access Credentials",
        instructions:
          "TD SYNNEX will create your partner profile in StreamOne® ION and generate access credentials.",
        title: "Account Creation",
        emailPreview: "now",
        description1: "TD SYNNEX will create the partner profile in StreamOne® ION and generate a single administrator user associated with the contact person indicated in the terms and conditions of the previous step.",
        description2: "After user creation, you will receive an email from Cloud Business Support (businessexperiencesu@techdata.com) with instructions to set up your password.",
        important: "Important",
        importantDesc: "Having an account in StreamOne® ION does not authorize you to transact on the platform. To do so, you must request access to the manufacturer's program in the next step.",
      },
      program_request: {
        label: "Program Request",
        instructions:
          "Request access to the manufacturer's program to enable transactions in StreamOne® ION.",
        title: "Program Request",
        description: "In this step, you request access to the manufacturer's program to enable transactions in StreamOne® ION.",
        stepsTitle: "Steps to follow:",
        step1: "Access StreamOne® ION",
        step1Link: "Go to StreamOne® ION →",
        step2: 'Navigate to "Partners" in the top menu.',
        step3: 'Select "Programs" in the left sidebar.',
        step4: "Search and select the program:",
        step5: 'Click "Request".',
        microsoftWarning: "Important for Microsoft CSP",
        microsoftWarningDesc: "When requesting the Microsoft CSP program, enter the Partner Location Account (formerly MPN ID). It can be found in Partner Center > Account Settings > Identifiers > CSP. An incorrect PLA causes errors in orders from StreamOne® ION.",
        googleWarning: "Important for Google",
        googleWarningDesc: "Even if the workload is only Google Cloud Platform, you must also request Google Workspace Reseller Program in addition to GCP Reseller Program to transact in StreamOne® ION.",
        awsNote: "Note for AWS",
        awsNoteDesc: "The program to request depends on the Partner Path selected (Services Path → AWS Solutions Provider / Software Path → AWS Technology Partner Program). Make sure to select the appropriate program.",
      },
      onboarding_complete: {
        label: "Program Authorization",
        instructions:
          "TD SYNNEX will review your request and authorize the program. With this confirmation, the onboarding process will be completed.",
        title: "Program Authorization",
        description: "TD SYNNEX is reviewing the program request. If the manufacturer configuration is correct, the program will be authorized within the next few hours.",
        confirmation: "The Customer Success Manager will confirm the program authorization. With this confirmation, the StreamOne® ION onboarding process will be completed.",
        whileReviewing: "While the program is under review",
        whileReviewingDesc: "While the program is under review, you will not be able to transact in StreamOne® ION.",
      },
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      notStarted: "Not Started",
      inProgress: "In Progress",
    },
    ui: {
      generalSteps: "Main Steps",
      substeps: "Substeps",
      timeline: "Timeline",
      generalNotes: "General Notes",
      overallProgress: "Overall Progress",
      instructions: "Instructions",
      addNote: "Add note",
      support: "Support",
      markComplete: "Mark as complete",
      completedOn: "Completed on",
      noNotesYet: "No notes yet.",
      newNote: "New note",
      save: "Save",
      cancel: "Cancel",
      writeNote: "Write your note...",
      substepsCompleted: "substeps completed",
      of: "of",
      lockedTooltip: "Unlocks when Step 1 and Step 2 are completed",
      contactAgent: "Contact",
      noteSaved: "Note saved",
      noteError: "Could not save note",
      deleteNote: "Delete note",
      fieldUpdated: "Field updated",
      fieldUpdateError: "Could not update field",
      loadingError: "Error loading data",
      retry: "Retry",
      tdSynnexWillComplete: "TD SYNNEX will mark this step as completed",
    },
  },

  pt: {
    steps: {
      step1: { title: "Passo 1: Configuração Inicial" },
      step2: {
        title: "Passo 2: Configuração do Fabricante",
        microsoft: "Passo 2: Microsoft Partner Center",
        aws: "Passo 2: AWS Partner Central",
        google: "Passo 2: Partner Sales Console (Google)",
      },
      step3: { title: "Passo 3: Finalização" },
    },
    substeps: {
      alta_hola_tdsynnex: {
        label: "Formulário de registo TD SYNNEX",
        instructions:
          "Complete o registo inicial na plataforma TDSynnex. Receberá um e-mail de boas-vindas com instruções detalhadas.",
        title: "Formulário de registo TD SYNNEX",
        description: "Aceda ao formulário de registo e preencha-o com os dados solicitados.",
        beforeStarting: "Antes de iniciar",
        beforeStartingDesc: "Prepare 1 documento comprovativo da atividade/epígrafe antes de começar.",
        actionRequired: "Ação necessária",
        accessForm: "Aceder ao formulário de registo →",
        acceptedDocuments: "Documentos aceites (um dos seguintes):",
        doc1Title: "Declaração de início de atividade",
        doc1Desc: "Cópia da declaração de início de atividade com a indicação clara do CAE.",
        doc2Title: "Certidão permanente",
        doc2Desc: "Cópia da certidão permanente com a indicação do objeto social.",
        doc3Title: "Certificado de revendedor",
        doc3Desc: "Cópia do certificado de revendedor autorizado.",
        internalReview: "Revisão interna",
        internalReviewDesc: "Após o envio do formulário, o pedido será analisado internamente pela nossa equipa.",
      },
      ecommerce_gk: {
        label: "Confirmação da conta TD SYNNEX",
        instructions:
          "Aguarde a confirmação da sua conta. Receberá um e-mail com os detalhes de acesso ou pedido de informações adicionais.",
        title: "Confirmação da conta TD SYNNEX",
        description: "Após enviar o formulário, analisamos o pedido. Dependendo do resultado, receberá um e-mail com informações adicionais ou a confirmação da sua conta.",
        possibleScenarios: "Cenários possíveis:",
        scenario1Title: "Pedido de informações adicionais",
        scenario1Desc: "Se faltar algum dado ou documento, enviaremos um e-mail a solicitar a partir de altaclientes.es@tdsynnex.com.",
        scenario2Title: "Confirmação do registo",
        scenario2Desc: "Quando a conta estiver criada, enviaremos um e-mail de confirmação com as informações da conta.",
        checkSpam: "Verifique a pasta de spam",
        checkSpamDesc: "Recomendamos verificar a pasta de spam/lixo eletrónico para não perder nenhuma comunicação.",
      },
      sepa_b2b_completado: {
        label: "Pedido de linha de crédito (SEPA B2B)",
        instructions:
          "Preencha o formulário SEPA B2B para configurar os pagamentos. Certifique-se de que tem os dados bancários corretos.",
        title: "Pedido de linha de crédito (SEPA B2B)",
        prerequisite: "Pré-requisito",
        prerequisiteDesc: "Este passo só é realizado quando a conta na TD SYNNEX já está criada.",
        stepsTitle: "Passos a seguir:",
        step1: "Aceda ao formulário SEPA B2B",
        step1Link: "Ir para o formulário →",
        step2: "Inicie sessão com as suas credenciais da Área de Clientes",
        step3: "Preencha o formulário com as informações solicitadas",
        step4: "Receba por e-mail o PDF \"Mandato SEPA B2B\"",
        step5: "Assine o PDF e anexe-o ao formulário juntamente com o comprovativo de titularidade da conta bancária",
        important: "Importante: Assinatura do mandato SEPA B2B",
        importantDesc: "Se o mandato SEPA B2B não estiver assinado e anexado, o pedido pode ser revogado e será necessário repetir o processo.",
      },
      rmt_ct_completado: {
        label: "Confirmação das condições de crédito",
        instructions:
          "A equipa financeira analisará o seu pedido e atribuirá as condições de crédito. Receberá uma confirmação por e-mail.",
        title: "Confirmação das condições de crédito",
        description: "Após enviar o SEPA B2B com a documentação necessária, a equipa financeira analisa o pedido e atribui as condições de crédito correspondentes.",
        additionalDocs: "Documentação adicional",
        additionalDocsDesc: "É possível que a equipa financeira solicite documentação adicional para completar a análise (exemplos: último IRC, balanço oficial, etc.).",
        finalConfirmation: "Confirmação final",
        finalConfirmationDesc: "A confirmação das condições de crédito será comunicada no mesmo fio de e-mail do processo de registo, através do Cloud Customer Success.",
      },
      alta_pac_mft: {
        label: "Registo PAC MFT",
        instructions:
          "Registe o seu Partner Admin Center (PAC) na Microsoft. Precisará das suas credenciais de parceiro Microsoft.",
        title: "Registo no Cloud Solutions Provider (CSP)",
        description: "Este registo habilita-o a operar como revendedor autorizado Microsoft CSP. Requer ter o Partner Center já ativo.",
        prerequisite: "Pré-requisito",
        prerequisiteDesc: "Deve ter acesso ao Partner Center antes de iniciar este passo.",
        actionRequired: "Ação necessária",
        accessLink: "Aceder ao registo de Partnership →",
        stepsTitle: "Passos a seguir:",
        step1: "Aceder ao link de registo",
        step1Desc: "Clique no link do Partner Enrollment.",
        step2: "Selecionar a opção \"Revender\"",
        step2Desc: "Da lista de opções, selecione 'Revender' (ou 'Resell' se aparecer em inglês).",
        step3: "Iniciar sessão com credenciais do Partner Center",
        step3Desc: "Utilize as credenciais da conta que já tem acesso ao Partner Center.",
        step4: "Seguir o assistente e completar a informação",
        step4Desc: "Preencha os dados solicitados no formulário.",
        step5: "Finalizar e verificar o Partner Center",
        step5Desc: "Verifique que o Partner Center fica operacional após o registo.",
        languageNote: "Nota sobre idioma",
        languageNoteDesc: "Se o portal mostrar opções em inglês, procure 'Resell' como equivalente a 'Revender'.",
      },
      alta_mf_cloud_ai: {
        label: "Registo Microsoft Cloud AI",
        instructions:
          "Complete o registo no Microsoft Cloud AI. Isto dará acesso às ferramentas de IA da Microsoft.",
        title: "Registo no Microsoft AI Cloud Partner Program",
        description: "Este registo é necessário se ainda não tiver Partner Center. Habilita o acesso ao Partner Center da Microsoft, a plataforma central para gerir a sua relação como parceiro.",
        partnerCenterInfo: "Criação do Partner Center",
        partnerCenterInfoDesc: "Este processo cria ou habilita o acesso ao Partner Center da Microsoft.",
        actionRequired: "Ação necessária",
        accessLink: "Aceder ao registo de Partnership →",
        stepsTitle: "Passos a seguir:",
        step1: "Aceder ao link de registo",
        step1Desc: "Clique no link do Partner Enrollment da Microsoft.",
        step2: "Selecionar apenas a opção \"Associar-se\"",
        step2Desc: "Da lista de opções, selecione apenas 'Associar-se' (Associate/Partnership).",
        step3: "Iniciar sessão com a conta profissional do Office 365",
        step3Desc: "Utilize a sua conta corporativa do Office 365. Se não tiver uma, crie uma nova conta profissional Microsoft.",
        step4: "Seguir o assistente de registo",
        step4Desc: "Complete a informação solicitada no formulário de registo.",
        step5: "Finalizar o registo e verificar o acesso",
        step5Desc: "Após finalizar, a página redireciona para o Partner Center. Verifique que consegue aceder corretamente.",
        professionalAccount: "Importante: Conta profissional",
        professionalAccountDesc: "Utilize uma conta profissional (tenant corporativo) para evitar incidências de administração e faturação.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Realize o handshake com a TD SYNNEX para validar a sua configuração Microsoft.",
        title: "Indirect Reseller Relationship",
        description: "Uma vez habilitado como CSP, deve aceitar o convite para estabelecer a relação Indirect Provider ↔ Indirect Reseller com a TD SYNNEX.",
        essentialStep: "Passo imprescindível",
        essentialStepDesc: "Este passo é imprescindível para que a TD SYNNEX possa associar a conta do Partner Center e operar como fornecedor indireto.",
        actionRequired: "Ação necessária: Aceitar convite",
        acceptInvitation: "Abrir link de convite da TD SYNNEX →",
        stepsTitle: "Passos a seguir:",
        step1: "Abrir o link de convite",
        step1Desc: "Clique no link de convite da TD SYNNEX.",
        step2: "Iniciar sessão com credenciais do Partner Center",
        step2Desc: "Utilize as credenciais da conta com acesso ao Partner Center.",
        step3: "Rever os termos e condições",
        step3Desc: "Leia os termos da associação Indirect Provider ↔ Indirect Reseller.",
        step4: "Assinar/Aceitar o Indirect Reseller Relationship",
        step4Desc: "Aceite o convite para estabelecer a relação indireta.",
        step5: "Confirmar que a relação fica aceite",
        step5Desc: "Verifique que a relação com a TD SYNNEX fica estabelecida corretamente.",
        adminPermissions: "Permissões de administração",
        adminPermissionsDesc: "Certifique-se de utilizar o utilizador com permissões de administração no tenant para completar a aceitação.",
      },
      aws_partner_account: {
        label: "Registo no AWS Partner Central",
        instructions:
          "Registe a empresa no AWS Partner Central a partir da AWS Console. É necessária uma AWS Account e autoridade legal para aceitar os termos.",
        title: "Registo no AWS Partner Central",
        description: "Neste passo registamos a empresa no AWS Partner Central a partir da AWS Console usando uma AWS Account. A pessoa que realize o registo deve ter autoridade legal para aceitar os termos.",
        alreadyHaveAccount: "Se já tiver AWS Partner Central",
        alreadyHaveAccountDesc: "Se a organização já tiver AWS Partner Central, não crie um novo. Marque este passo como concluído e confirme no passo seguinte se já está inscrito num Partner Path.",
        prerequisite: "Pré-requisito",
        prerequisiteDesc: "Requisito: dispor de uma AWS Account que será usada como conta vinculada/designada para o Partner Central + acesso à AWS Console.",
        stepsTitle: "Passos a seguir:",
        step1: "Selecionar a AWS Account",
        step1Desc: "Selecione a AWS Account que a organização utilizará para gerir o Partner Central.",
        step2: "Iniciar sessão na AWS Console",
        step2Desc: "Inicie sessão na AWS Console com essa conta.",
        step3: "Abrir o AWS Partner Central",
        step3Desc: "No campo de pesquisa, abra \"AWS Partner Central\" e clique em \"Get started\".",
        step4: "Completar a verificação de identidade",
        step4Desc: "Rever requisitos → \"Continue to Registration\" → Digitalizar o QR e completar o fluxo (selfie + ID) → \"Next\" até ver \"Complete\".",
        step5: "Completar a verificação de negócio",
        step5Desc: "Completar a verificação de negócio com dados fiscais/legais → rever → enviar.",
        step6: "Finalizar o registo",
        step6Desc: "Com ambas as verificações validadas, clique em \"Continue Registration\" para finalizar o formulário.",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante AWS.",
      },
      aws_partner_engagement: {
        label: "Inscrever-se num Partner Path",
        instructions:
          "Selecione o tipo de atividade como parceiro (Services ou Software). Este passo habilita o acesso a programas e benefícios da AWS.",
        title: "Inscrever-se num AWS Partner Path",
        description: "Selecione o tipo de atividade como parceiro (Services ou Software). Mais tarde podem ser ativados tantos Paths quanto necessário.",
        alreadyRegistered: "Se já estiver inscrito",
        alreadyRegisteredDesc: "Se a organização já estiver inscrita num Partner Path da AWS, marque este passo como concluído.",
        pathExplanation: "Explicação dos Partner Paths:",
        servicesPath: "Services Path",
        servicesPathDesc: "Orientado para consultoria, serviços geridos e/ou revenda de serviços sobre AWS.",
        softwarePath: "Software Path",
        softwarePathDesc: "Orientado para organizações que desenvolvem software próprio baseado ou integrado com AWS.",
        stepsTitle: "Passos a seguir:",
        step1: "Iniciar sessão no AWS Partner Central",
        step1Desc: "Aceder ao AWS Partner Central",
        step2: "Deslocar até AWS Partner Paths",
        step2Desc: "Na Home, deslocar até à secção \"AWS Partner Paths\".",
        step3: "Escolher o Path e inscrever-se",
        step3Desc: "Escolher o Path (Services ou Software) e clicar em \"Enroll\".",
        step4: "Rever e continuar",
        step4Desc: "Rever a informação e clicar em \"Continuar\".",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante AWS.",
      },
      aws_form: {
        label: "Preencher o AWS Form",
        instructions:
          "Formulário interno para configurar a relação entre o parceiro e a TD SYNNEX como distribuidor.",
        title: "Preencher o AWS Form",
        description: "Este formulário permite-nos configurar a relação entre a organização do parceiro e a TD SYNNEX.",
        formSubmittedSuccess: "Formulário enviado com sucesso",
        formSubmittedDesc: "A sua informação foi guardada no Google Sheets.",
        submissionIdLabel: "ID de Submissão:",
        orgNameLabel: "Nome legal da organização",
        orgNamePlaceholder: "Nome legal da organização",
        legalRepLabel: "Nome do representante legal (no AWS Partner Central)",
        legalRepPlaceholder: "Nome do representante legal",
        legalRepEmailLabel: "E-mail do representante legal",
        legalRepEmailPlaceholder: "email@exemplo.com",
        partnerPathLabel: "AWS Partner Path",
        partnerPathPlaceholder: "Selecione o Partner Path",
        servicesPathOption: "Services path",
        softwarePathOption: "Software path",
        partnerTierLabel: "Partner Tier",
        partnerTierPlaceholder: "Selecione o Partner Tier",
        apnIdLabel: "APN ID",
        apnIdPlaceholder: "APN ID",
        solutionProviderLabel: "Solution provider",
        certificationLabel: "Tem alguma certificação AWS?",
        reservedInstancesLabel: "Já tem instâncias reservadas implementadas?",
        dedicatedOrgLabel: "Precisa de uma organização dedicada (Master Payer Account)?",
        clientsDedicatedOrgLabel: "Algum dos seus clientes precisa de uma organização dedicada (Master Payer Account)?",
        supportPlanLabel: "Tem contratado um plano de suporte além do suporte básico da AWS?",
        supportPlanPlaceholder: "Descreva o seu plano de suporte",
        submitButton: "Enviar",
        requiredField: "Campo obrigatório",
        invalidEmail: "Formato de e-mail inválido",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante AWS.",
      },
      aws_dsa: {
        label: "Assinar o DSA",
        instructions:
          "O Distribution Seller Agreement habilita a revenda através da TD SYNNEX como distribuidor grossista autorizado da AWS.",
        title: "Assinar o DSA (Distribution Seller Agreement)",
        description: "O Distribution Seller Agreement (DSA) é o contrato que habilita a revenda através da TD SYNNEX como distribuidor grossista autorizado da AWS.",
        alreadyHaveDsa: "Se já tiver DSA assinado",
        alreadyHaveDsaDesc: "Se a organização já tiver um Distribution Seller Agreement assinado com a TD SYNNEX em qualquer país da região EEA, marque este passo como concluído.",
        signatureRequired: "Assinatura necessária do Representante Legal",
        signatureRequiredDesc: "Uma vez que o DSA esteja assinado pela TD SYNNEX e AWS, a AWS enviará um e-mail ao Representante Legal do AWS Partner Central para assinar via DocuSign. Sem essa assinatura, o contrato não é válido.",
        stepsTitle: "Passos a seguir:",
        step1: "Aceder ao AWS Partner Central",
        step1Desc: "Iniciar sessão no AWS Partner Central",
        step2: "Ir a Programs → Engagement Requests",
        step2Desc: "Ir a Programs → \"Engagement Requests\".",
        step3: "Criar aplicação",
        step3Desc: "Clicar em \"Create application\".",
        step4: "Selecionar país de transação",
        step4Desc: "Selecionar país de transação (Espanha ou Portugal).",
        step5: "Selecionar TD SYNNEX Corporation",
        step5Desc: "Selecionar \"TD SYNNEX Corporation\".",
        step6: "Preencher informação legal",
        step6Desc: "Preencher a informação legal → enviar pedido.",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante AWS.",
      },
      aws_marketplace: {
        label: "AWS Account linking / Marketplace",
        instructions:
          "Vincule a conta do AWS Partner Central com a conta de vendedor do AWS Marketplace.",
        title: "AWS Account linking (Partner Central ↔ AWS Marketplace)",
        description: "Vincule a conta do AWS Partner Central com a conta de vendedor do AWS Marketplace.",
        roleRequirement: "Requisito: função Alliance Lead ou Cloud Admin",
        roleRequirementDesc: "Requisito: função Alliance Lead ou Cloud Admin. Durante o fluxo são criadas/atribuídas funções IAM padrão (PartnerCentralRoleForCloudAdmin / PartnerCentralRoleForAlliance / PartnerCentralRoleForAce).",
        stepsTitle: "Passos a seguir:",
        step1: "Iniciar sessão como Alliance Lead ou Cloud Administrator",
        step1Desc: "Iniciar sessão no AWS Partner Central como Alliance Lead ou Cloud Administrator.",
        step2: "Selecionar Vincular contas",
        step2Desc: "Na Home (canto superior direito) selecionar \"Vincular contas\".",
        step3: "Iniciar vinculação",
        step3Desc: "Clicar em \"Continuar com a vinculação da conta\" e depois \"Iniciar a vinculação da conta\".",
        step4: "Verificar AWS Account ID",
        step4Desc: "Abre-se a AWS Console: Verificar AWS Account ID. Em \"Denominação social legal\", escrever razão social. \"Seguinte\".",
        step5: "Marcar caixas conforme aplicável",
        step5Desc: "Marcar caixas conforme aplicável: Cloud Admin IAM role (PartnerCentralRoleForCloudAdmin-###), Alliance team IAM role (PartnerCentralRoleForAlliance-###), ACE IAM role (PartnerCentralRoleForAce-###).",
        step6: "Vincular contas",
        step6Desc: "\"Seguinte\" → \"Vincular contas\" e verificar confirmação.",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante AWS.",
      },
      gc_id: {
        label: "Google Cloud ID",
        instructions:
          "Introduza o seu Google Cloud ID. Pode encontrá-lo na consola do Google Cloud Platform.",
      },
      google_cloud_domain: {
        label: "Domínio Google Cloud",
        instructions:
          "Introduza o domínio associado à sua conta do Google Cloud.",
      },
      google_cloud_id_group: {
        label: "Google Cloud ID",
        instructions: "Configure a sua identificação do Google Cloud",
        gc_id_label: "Google Cloud ID (GC_ID)",
        gc_id_placeholder: "Introduza o seu Google Cloud ID",
        domain_label: "Domínio do Google Cloud",
        domain_placeholder: "exemplo.com (sem http/https)",
        save_button: "Guardar",
        completed_alert: "Concluído: Ambos os campos estão configurados corretamente.",
        pending_alert: "Pendente: Complete ambos os campos para finalizar o subpasso.",
        info_alert: "Introduza o identificador do Google Cloud (GC_ID) e o domínio principal da organização. Estes dados são usados para configurar e validar o onboarding.",
        success_message: "Dados guardados com sucesso",
        notApplicable: "Não aplicável",
        notApplicableDesc: "Este subpasso só se aplica a onboardings com fabricante Google.",
      },
      ion_tc_aceptados: {
        label: "Condições do StreamOne® ION",
        instructions:
          "Aceite os termos e condições do StreamOne® ION. Leia-os com atenção antes de aceitar.",
        title: "Termos e condições do StreamOne® ION",
        emailPreview: "agora",
        description: "A TD SYNNEX enviou os termos e condições do StreamOne® ION para o endereço de e-mail indicado para o processo.",
        locateEmail: "Localize o e-mail",
        locateEmailDesc: "Localize um e-mail de no-reply@bryter.io com o assunto: TD SYNNEX - Streamone Ion Platform Agreement Terms - Please Acknowledge.",
        stepsTitle: "Passos a seguir:",
        step1: "Localize o e-mail indicado na caixa de entrada.",
        step2: "Abra o link https://techdata-legal.bryter....",
        step3: "Revise as informações da organização (painel esquerdo).",
        step4: "Revise o contrato do StreamOne® ION (painel direito).",
        step5: 'Selecione "Acknowledge" e clique em "Next" para confirmar os termos.',
        notReceivedTitle: "Se ainda não recebeu o contrato do StreamOne® ION...",
        contactCSM: "Entre em contacto com o seu Customer Success Manager",
      },
      access_ion: {
        label: "Credenciais de acesso",
        instructions:
          "A TD SYNNEX criará o seu perfil de parceiro no StreamOne® ION e gerará as credenciais de acesso.",
        title: "Criação da conta",
        emailPreview: "agora",
        description1: "A TD SYNNEX criará o perfil de parceiro no StreamOne® ION e gerará um único utilizador administrador associado à pessoa de contacto indicada nos termos e condições do passo anterior.",
        description2: "Após a criação do utilizador, receberá um e-mail do Cloud Business Support (businessexperiencesu@techdata.com) com as instruções para configurar a palavra-passe.",
        important: "Importante",
        importantDesc: "Ter uma conta no StreamOne® ION não autoriza a transacionar na plataforma. Para isso, é necessário solicitar acesso ao programa do fabricante no passo seguinte.",
      },
      program_request: {
        label: "Solicitação de programas",
        instructions:
          "Solicite acesso ao programa do fabricante para habilitar a transação no StreamOne® ION.",
        title: "Solicitação do programa",
        description: "Neste passo, solicita-se o acesso ao programa do fabricante para habilitar a transação no StreamOne® ION.",
        stepsTitle: "Passos a seguir:",
        step1: "Aceda ao StreamOne® ION",
        step1Link: "Ir para StreamOne® ION →",
        step2: 'Navegue até "Partners" no menu superior.',
        step3: 'Selecione "Programs" no menu lateral esquerdo.',
        step4: "Procure e selecione o programa:",
        step5: 'Clique em "Request".',
        microsoftWarning: "Importante para Microsoft CSP",
        microsoftWarningDesc: "Ao solicitar o programa Microsoft CSP, introduza o Partner Location Account (anteriormente MPN ID). Encontra-se em Partner Center > Account Settings > Identifiers > CSP. Um PLA incorreto causa erros em encomendas a partir do StreamOne® ION.",
        googleWarning: "Importante para Google",
        googleWarningDesc: "Mesmo que o workload seja apenas Google Cloud Platform, é necessário solicitar também o Google Workspace Reseller Program além do GCP Reseller Program para transacionar no StreamOne® ION.",
        awsNote: "Nota para AWS",
        awsNoteDesc: "O programa a solicitar depende do Partner Path selecionado (Services Path → AWS Solutions Provider / Software Path → AWS Technology Partner Program). Certifique-se de selecionar o programa adequado.",
      },
      onboarding_complete: {
        label: "Autorização de programas",
        instructions:
          "A TD SYNNEX analisará a sua solicitação e autorizará o programa. Com esta confirmação, o processo de integração ficará concluído.",
        title: "Autorização do programa",
        description: "A TD SYNNEX está a analisar a solicitação do programa. Se a configuração no fabricante estiver correta, o programa será autorizado nas próximas horas.",
        confirmation: "O Customer Success Manager confirmará a autorização do programa. Com esta confirmação, o processo de integração no StreamOne® ION ficará concluído.",
        whileReviewing: "Enquanto o programa estiver em análise",
        whileReviewingDesc: "Enquanto o programa estiver em análise, não será possível transacionar no StreamOne® ION.",
      },
    },
    status: {
      completed: "Concluído",
      pending: "Pendente",
      notStarted: "Não Iniciado",
      inProgress: "Em Progresso",
    },
    ui: {
      generalSteps: "Passos Principais",
      substeps: "Subpassos",
      timeline: "Linha do Tempo",
      generalNotes: "Notas Gerais",
      overallProgress: "Progresso Geral",
      instructions: "Instruções",
      addNote: "Adicionar nota",
      support: "Suporte",
      markComplete: "Marcar como concluído",
      completedOn: "Concluído em",
      noNotesYet: "Ainda não há notas.",
      newNote: "Nova nota",
      save: "Salvar",
      cancel: "Cancelar",
      writeNote: "Escreva sua nota...",
      substepsCompleted: "subpassos concluídos",
      of: "de",
      lockedTooltip: "Desbloqueia quando Passo 1 e Passo 2 estiverem concluídos",
      contactAgent: "Contatar",
      noteSaved: "Nota salva",
      noteError: "Não foi possível salvar a nota",
      deleteNote: "Excluir nota",
      fieldUpdated: "Campo atualizado",
      fieldUpdateError: "Não foi possível atualizar o campo",
      loadingError: "Erro ao carregar dados",
      retry: "Tentar novamente",
      tdSynnexWillComplete: "A TD SYNNEX marcará este passo como concluído",
    },
  },
};

/**
 * Get translation text by key path
 */
export function getTranslation(
  lang: Language,
  keyPath: string
): string {
  const keys = keyPath.split(".");
  let current: any = translations[lang];

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return keyPath; // Return key if not found
    }
  }

  return typeof current === "string" ? current : keyPath;
}

/**
 * Hook to use tracker translations
 */
export function useTrackerTranslations(lang?: Language): TrackerTranslations {
  const language = lang || (typeof window !== "undefined"
    ? (localStorage.getItem("language") as Language) || "es"
    : "es");

  return translations[language] || translations.es;
}
