import { TextInput, TextInputProps, useTheme } from "react-native-paper";

const AppTextInput = (props: TextInputProps) => {
  const theme = useTheme()
  return (
    <TextInput
      {...props}
      style={[
        {
          backgroundColor: theme.colors.secondaryContainer,
        },
        props.style,
      ]}
      textColor={theme.colors.primary}
    />
  );
};

export default AppTextInput;
