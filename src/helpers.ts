import { Logger } from '@nestjs/common';
import {
  isEmpty,
  omitBy,
  isNil,
  isNull,
  isNaN,
  isUndefined,
  get,
} from 'lodash';

const sgMail = require('@sendgrid/mail');

export const sendMail = (token: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'mohit2728dhawan45@gmail.com', // Change to your recipient
    from: 'mohitd@gluelabs.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: "sending text",
    html: `<strong>${token}</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.log(process.env.SENDGRID_API_KEY);

      console.log('hogya kuchh');

      console.error(error);
    });
};
export const getErrorCodeAndMessage = (
  error: unknown,
  { log }: { log: boolean } = { log: true },
): { code: string; message: string } => {
  if (log) {
    Logger.error(error);
  }

  return {
    code: get(error, 'code', get(error, 'response.code', 'SYSTEM_ERROR')),
    message: get(
      error,
      'message',
      get(error, 'response.message', 'Internal Server Error'),
    ),
  };
};
