
export function getTemplateName(template_id) {
  let templateName = 'BasicTemplate';

  switch(template_id) {
    case 1: {
      templateName = 'BasicTemplate'; break;
    }
    case 2: {
      templateName = 'ContactTemplate'; break;
    }
    case 3: {
      templateName = 'HomeTemplate'; break;
    }
    case 4: {
      templateName = 'LoginTemplate'; break;
    }
    case 5: {
      templateName = 'PaymentTemplate'; break;
    }
    case 6: {
      templateName = 'SignupTemplate'; break;
    }
    case 7: {
      templateName = 'ForgotPasswordTemplate'; break;
    }
    case 8: {
      templateName = 'ResetPasswordTemplate'; break;
    }
    case 9: {
      templateName = 'IndexTemplate'; break;
    }
    default: {
      break;
    }
  }

  return templateName;
}