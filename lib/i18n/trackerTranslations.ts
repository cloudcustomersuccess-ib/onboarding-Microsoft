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
    };
    ecommerce_gk: {
      label: string;
      instructions: string;
    };
    sepa_b2b_completado: {
      label: string;
      instructions: string;
    };
    rmt_ct_completado: {
      label: string;
      instructions: string;
    };

    // Step 2 - Microsoft
    alta_pac_mft: {
      label: string;
      instructions: string;
    };
    alta_mf_cloud_ai: {
      label: string;
      instructions: string;
    };
    td_handshake_mft: {
      label: string;
      instructions: string;
    };

    // Step 2 - AWS
    aws_partner_account: {
      label: string;
      instructions: string;
    };
    aws_partner_engagement: {
      label: string;
      instructions: string;
    };
    aws_form: {
      label: string;
      instructions: string;
    };
    aws_dsa: {
      label: string;
      instructions: string;
    };
    aws_marketplace: {
      label: string;
      instructions: string;
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
    };

    // Step 3
    ion_tc_aceptados: {
      label: string;
      instructions: string;
    };
    program_request: {
      label: string;
      instructions: string;
    };
    access_ion: {
      label: string;
      instructions: string;
    };
    onboarding_complete: {
      label: string;
      instructions: string;
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
      },
      ecommerce_gk: {
        label: "Confirmación de la cuenta en TD SYNNEX",
        instructions:
          "Espera la confirmación de tu cuenta. Recibirás un correo con los detalles de acceso o solicitud de información adicional.",
      },
      sepa_b2b_completado: {
        label: "Solicitud de línea de crédito (SEPA B2B)",
        instructions:
          "Completa el formulario SEPA B2B para configurar los pagos. Asegúrate de tener los datos bancarios correctos.",
      },
      rmt_ct_completado: {
        label: "Confirmación de condiciones de crédito",
        instructions:
          "El equipo financiero revisará tu solicitud y asignará las condiciones de crédito. Recibirás una confirmación por correo.",
      },
      alta_pac_mft: {
        label: "Alta PAC MFT",
        instructions:
          "Registra tu Partner Admin Center (PAC) en Microsoft. Necesitarás tus credenciales de partner de Microsoft.",
      },
      alta_mf_cloud_ai: {
        label: "Alta Microsoft Cloud AI",
        instructions:
          "Completa el alta en Microsoft Cloud AI. Esto te permitirá acceder a las herramientas de IA de Microsoft.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Realiza el handshake con TD SYNNEX para validar tu configuración de Microsoft.",
      },
      aws_partner_account: {
        label: "Alta en AWS Partner Central",
        instructions:
          "Registra la empresa en AWS Partner Central desde la AWS Console. Se requiere una AWS Account y autoridad legal para aceptar términos.",
      },
      aws_partner_engagement: {
        label: "Enrólate en un Partner Path",
        instructions:
          "Selecciona el tipo de actividad como partner (Services o Software). Este paso habilita el acceso a programas y beneficios de AWS.",
      },
      aws_form: {
        label: "Completa el AWS Form",
        instructions:
          "Formulario interno para configurar la relación entre el partner y TD SYNNEX como distribuidor.",
      },
      aws_dsa: {
        label: "Firma el DSA",
        instructions:
          "El Distribution Seller Agreement habilita la reventa a través de TD SYNNEX como distribuidor mayorista autorizado de AWS.",
      },
      aws_marketplace: {
        label: "AWS Account linking / Marketplace",
        instructions:
          "Vincula la cuenta de AWS Partner Central con la cuenta de vendedor de AWS Marketplace.",
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
      },
      ion_tc_aceptados: {
        label: "ION T&C Aceptados",
        instructions:
          "Acepta los términos y condiciones de ION. Léelos cuidadosamente antes de aceptar.",
      },
      program_request: {
        label: "Program Request",
        instructions:
          "Solicita tu ingreso al programa. Un representante revisará tu solicitud en breve.",
      },
      access_ion: {
        label: "Acceso a ION",
        instructions:
          "Confirma que has recibido y probado tu acceso a la plataforma ION. Verifica que puedes iniciar sesión correctamente.",
      },
      onboarding_complete: {
        label: "Onboarding Completo",
        instructions:
          "TD SYNNEX confirmará que tu onboarding está completo. Recibirás una notificación cuando todo esté finalizado.",
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
      },
      ecommerce_gk: {
        label: "TD SYNNEX Account Confirmation",
        instructions:
          "Wait for your account confirmation. You will receive an email with access details or a request for additional information.",
      },
      sepa_b2b_completado: {
        label: "Credit Line Request (SEPA B2B)",
        instructions:
          "Complete the SEPA B2B form to set up payments. Make sure you have the correct bank details.",
      },
      rmt_ct_completado: {
        label: "Credit Conditions Confirmation",
        instructions:
          "The finance team will review your request and assign credit conditions. You will receive email confirmation.",
      },
      alta_pac_mft: {
        label: "PAC MFT Registration",
        instructions:
          "Register your Partner Admin Center (PAC) with Microsoft. You will need your Microsoft partner credentials.",
      },
      alta_mf_cloud_ai: {
        label: "Microsoft Cloud AI Registration",
        instructions:
          "Complete the Microsoft Cloud AI registration. This will give you access to Microsoft AI tools.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Perform the handshake with TD SYNNEX to validate your Microsoft setup.",
      },
      aws_partner_account: {
        label: "AWS Partner Central Registration",
        instructions:
          "Register the company in AWS Partner Central from the AWS Console. An AWS Account is required along with legal authority to accept terms.",
      },
      aws_partner_engagement: {
        label: "Enroll in a Partner Path",
        instructions:
          "Select the type of partner activity (Services or Software). This step enables access to AWS programs and benefits.",
      },
      aws_form: {
        label: "Complete AWS Form",
        instructions:
          "Internal form to configure the relationship between the partner and TD SYNNEX as a distributor.",
      },
      aws_dsa: {
        label: "Sign the DSA",
        instructions:
          "The Distribution Seller Agreement enables resale through TD SYNNEX as an authorized AWS wholesale distributor.",
      },
      aws_marketplace: {
        label: "AWS Account Linking / Marketplace",
        instructions:
          "Link the AWS Partner Central account with the AWS Marketplace seller account.",
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
      },
      ion_tc_aceptados: {
        label: "ION T&C Accepted",
        instructions:
          "Accept the ION terms and conditions. Read them carefully before accepting.",
      },
      program_request: {
        label: "Program Request",
        instructions:
          "Request your program enrollment. A representative will review your request shortly.",
      },
      access_ion: {
        label: "ION Access",
        instructions:
          "Confirm that you have received and tested your access to the ION platform. Verify that you can log in correctly.",
      },
      onboarding_complete: {
        label: "Onboarding Complete",
        instructions:
          "TD SYNNEX will confirm that your onboarding is complete. You will receive a notification when everything is finalized.",
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
        label: "Formulário de registro TD SYNNEX",
        instructions:
          "Complete o registro inicial na plataforma TDSynnex. Você receberá um e-mail de boas-vindas com instruções detalhadas.",
      },
      ecommerce_gk: {
        label: "Confirmação da conta TD SYNNEX",
        instructions:
          "Aguarde a confirmação da sua conta. Você receberá um e-mail com detalhes de acesso ou solicitação de informações adicionais.",
      },
      sepa_b2b_completado: {
        label: "Solicitação de linha de crédito (SEPA B2B)",
        instructions:
          "Preencha o formulário SEPA B2B para configurar pagamentos. Certifique-se de ter os dados bancários corretos.",
      },
      rmt_ct_completado: {
        label: "Confirmação de condições de crédito",
        instructions:
          "A equipe financeira revisará sua solicitação e atribuirá as condições de crédito. Você receberá uma confirmação por e-mail.",
      },
      alta_pac_mft: {
        label: "Registro PAC MFT",
        instructions:
          "Registre seu Partner Admin Center (PAC) na Microsoft. Você precisará das suas credenciais de parceiro da Microsoft.",
      },
      alta_mf_cloud_ai: {
        label: "Registro Microsoft Cloud AI",
        instructions:
          "Complete o registro no Microsoft Cloud AI. Isso dará acesso às ferramentas de IA da Microsoft.",
      },
      td_handshake_mft: {
        label: "TD Handshake MFT",
        instructions:
          "Realize o handshake com TD SYNNEX para validar sua configuração da Microsoft.",
      },
      aws_partner_account: {
        label: "Conta AWS Partner",
        instructions:
          "Crie sua conta AWS Partner. Visite o portal AWS Partner Network e complete o registro.",
      },
      aws_partner_engagement: {
        label: "AWS Partner Engagement",
        instructions:
          "Complete o processo de engajamento com AWS. Isso inclui a aceitação de termos e condições.",
      },
      aws_form: {
        label: "Formulário AWS",
        instructions:
          "Preencha o formulário AWS com as informações da sua empresa.",
      },
      aws_dsa: {
        label: "AWS DSA",
        instructions:
          "Assine o Acordo de Distribuição de Software (DSA) da AWS.",
      },
      aws_marketplace: {
        label: "AWS Marketplace",
        instructions:
          "Complete o registro no AWS Marketplace para vender suas soluções.",
      },
      gc_id: {
        label: "Google Cloud ID",
        instructions:
          "Digite seu Google Cloud ID. Você pode encontrá-lo no console do Google Cloud Platform.",
      },
      google_cloud_domain: {
        label: "Domínio Google Cloud",
        instructions:
          "Digite o domínio associado à sua conta do Google Cloud.",
      },
      google_cloud_id_group: {
        label: "Google Cloud ID",
        instructions: "Configure sua identificação do Google Cloud",
        gc_id_label: "Google Cloud ID (GC_ID)",
        gc_id_placeholder: "Digite seu Google Cloud ID",
        domain_label: "Domínio do Google Cloud",
        domain_placeholder: "exemplo.com (sem http/https)",
        save_button: "Salvar",
        completed_alert: "Concluído: Ambos os campos estão configurados corretamente.",
        pending_alert: "Pendente: Complete ambos os campos para finalizar o subpasso.",
        info_alert: "Digite o identificador do Google Cloud (GC_ID) e o domínio principal da organização. Esses dados são usados para configurar e validar o onboarding.",
        success_message: "Dados salvos com sucesso",
      },
      ion_tc_aceptados: {
        label: "ION T&C Aceitos",
        instructions:
          "Aceite os termos e condições do ION. Leia-os com atenção antes de aceitar.",
      },
      program_request: {
        label: "Solicitação de Programa",
        instructions:
          "Solicite sua inscrição no programa. Um representante revisará sua solicitação em breve.",
      },
      access_ion: {
        label: "Acesso ao ION",
        instructions:
          "Confirme que recebeu e testou seu acesso à plataforma ION. Verifique se você pode fazer login corretamente.",
      },
      onboarding_complete: {
        label: "Onboarding Completo",
        instructions:
          "A TD SYNNEX confirmará que seu onboarding está completo. Você receberá uma notificação quando tudo estiver finalizado.",
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
