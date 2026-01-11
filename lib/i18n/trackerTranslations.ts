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
    sepa_b2b_completado: {
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

    // Step 3
    ion_tc_aceptados: {
      label: string;
      instructions: string;
    };
    program_request: {
      label: string;
      instructions: string;
    };
  };

  // Status labels
  status: {
    completed: string;
    pending: string;
    notStarted: string;
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
        label: "Alta Hola TDSynnex",
        instructions:
          "Completa el registro inicial en la plataforma TDSynnex. Recibirás un email de bienvenida con las instrucciones detalladas.",
      },
      sepa_b2b_completado: {
        label: "SEPA B2B Completado",
        instructions:
          "Completa el formulario SEPA B2B para configurar los pagos. Asegúrate de tener los datos bancarios correctos.",
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
        label: "AWS Partner Account",
        instructions:
          "Crea tu cuenta de AWS Partner. Visita el portal de AWS Partner Network y completa el registro.",
      },
      aws_partner_engagement: {
        label: "AWS Partner Engagement",
        instructions:
          "Completa el proceso de engagement con AWS. Esto incluye la aceptación de términos y condiciones.",
      },
      aws_form: {
        label: "AWS Form",
        instructions:
          "Rellena el formulario de AWS con la información de tu empresa.",
      },
      aws_dsa: {
        label: "AWS DSA",
        instructions:
          "Firma el Acuerdo de Distribución de Software (DSA) de AWS.",
      },
      aws_marketplace: {
        label: "AWS Marketplace",
        instructions:
          "Completa el registro en AWS Marketplace para vender tus soluciones.",
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
    },
    status: {
      completed: "Completado",
      pending: "Pendiente",
      notStarted: "No iniciado",
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
        label: "TDSynnex Welcome Registration",
        instructions:
          "Complete the initial registration on the TDSynnex platform. You will receive a welcome email with detailed instructions.",
      },
      sepa_b2b_completado: {
        label: "SEPA B2B Completed",
        instructions:
          "Complete the SEPA B2B form to set up payments. Make sure you have the correct bank details.",
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
        label: "AWS Partner Account",
        instructions:
          "Create your AWS Partner account. Visit the AWS Partner Network portal and complete the registration.",
      },
      aws_partner_engagement: {
        label: "AWS Partner Engagement",
        instructions:
          "Complete the AWS engagement process. This includes accepting terms and conditions.",
      },
      aws_form: {
        label: "AWS Form",
        instructions: "Fill out the AWS form with your company information.",
      },
      aws_dsa: {
        label: "AWS DSA",
        instructions: "Sign the AWS Software Distribution Agreement (DSA).",
      },
      aws_marketplace: {
        label: "AWS Marketplace",
        instructions:
          "Complete the AWS Marketplace registration to sell your solutions.",
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
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      notStarted: "Not Started",
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
        label: "Registro de Boas-Vindas TDSynnex",
        instructions:
          "Complete o registro inicial na plataforma TDSynnex. Você receberá um e-mail de boas-vindas com instruções detalhadas.",
      },
      sepa_b2b_completado: {
        label: "SEPA B2B Concluído",
        instructions:
          "Preencha o formulário SEPA B2B para configurar pagamentos. Certifique-se de ter os dados bancários corretos.",
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
    },
    status: {
      completed: "Concluído",
      pending: "Pendente",
      notStarted: "Não Iniciado",
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
