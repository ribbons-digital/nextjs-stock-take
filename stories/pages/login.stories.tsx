import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import UserForm from "@/components/UserForm";

export default {
  title: "Pages/User Form",
  component: UserForm,
} as ComponentMeta<typeof UserForm>;

const Template: ComponentStory<typeof UserForm> = (args) => (
  <UserForm {...args} />
);

export const LoginPage = Template.bind({});
LoginPage.args = {
  isSignup: false,
};
export const SignupPage = Template.bind({});
SignupPage.args = {
  isSignup: true,
};
