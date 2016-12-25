
export function getTemplateName(template_id) {
  let templateName = 'BasicTemplate';

  switch(template_id) {
    case 1: {
      templateName = 'BasicTemplate'; break;
    }
    case 2: {
      templateName = 'IndexTemplate'; break;
    }
    case 3: {
      templateName = 'ContactTemplate'; break;
    }
    case 4: {
      templateName = 'HomeTemplate'; break;
    }
    case 5: {
      templateName = 'LoginTemplate'; break;
    }
    case 6: {
      templateName = 'PaymentTemplate'; break;
    }
    case 7: {
      templateName = 'SignupTemplate'; break;
    }
    case 8: {
      templateName = 'ForgotPasswordTemplate'; break;
    }
    case 9: {
      templateName = 'ResetPasswordTemplate'; break;
    }
    default: {
      break;
    }
  }

  return templateName;
}