import type { TypographyStyle } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    heroValue: TypographyStyle;
    cardTitle: TypographyStyle;
    valueLarge: TypographyStyle;
  }
  interface TypographyVariantsOptions {
    heroValue?: TypographyStyle;
    cardTitle?: TypographyStyle;
    valueLarge?: TypographyStyle;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    heroValue: true;
    cardTitle: true;
    valueLarge: true;
  }
}

export {};
