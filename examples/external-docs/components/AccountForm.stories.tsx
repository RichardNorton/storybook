/* eslint-disable storybook/await-interactions */
/* eslint-disable storybook/use-storybook-testing-library */
// @TODO: use addon-interactions and remove the rule disable above
import { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { AccountForm } from './AccountForm';

export default {
  component: AccountForm,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AccountForm>;

export const Standard: ComponentStoryObj<typeof AccountForm> = {
  args: { passwordVerification: false },
};

export const StandardEmailFilled = {
  ...Standard,
  play: () => userEvent.type(screen.getByTestId('email'), 'michael@chromatic.com'),
};

export const StandardEmailFailed = {
  ...Standard,
  play: async () => {
    await userEvent.type(screen.getByTestId('email'), 'michael@chromatic.com.com@com');
    await userEvent.type(screen.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const StandardPasswordFailed = {
  ...Standard,
  play: async () => {
    await StandardEmailFilled.play();
    await userEvent.type(screen.getByTestId('password1'), 'asdf');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const StandardFailHover = {
  ...StandardPasswordFailed,
  play: async () => {
    await StandardPasswordFailed.play();
    await sleep(100);
    await userEvent.hover(screen.getByTestId('password-error-info'));
  },
};

export const Verification: ComponentStoryObj<typeof AccountForm> = {
  args: { passwordVerification: true },
};

export const VerificationPasssword1 = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const VerificationPasswordMismatch = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf');
    await userEvent.type(screen.getByTestId('password2'), 'asdf1234');
    await userEvent.click(screen.getByTestId('submit'));
  },
};

export const VerificationSuccess = {
  ...Verification,
  play: async () => {
    await StandardEmailFilled.play();
    await sleep(1000);
    await userEvent.type(screen.getByTestId('password1'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.type(screen.getByTestId('password2'), 'asdfasdf', { delay: 50 });
    await sleep(1000);
    await userEvent.click(screen.getByTestId('submit'));
  },
};
