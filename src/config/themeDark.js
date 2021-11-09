import { NConfigProvider } from 'naive-ui'
import theme from "tailwindcss/defaultTheme"
import colors from "tailwindcss/colors"

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
export default {
  "common": {
    "primaryColor": colors.blue["600"],
    "primaryColorHover": colors.blue["700"],
    "primaryColorPressed": colors.blue["600"],
    "infoColor": colors.blue["600"],
    "infoColorHover": colors.blue["700"],
    "infoColorPressed": colors.blue["600"],
    "infoColorSuppl": colors.blue["500"],
    "successColor": colors.green["600"],
    "successColorHover": colors.green["700"],
    "successColorPressed": colors.green["600"],
    "successColorSuppl": colors.green["600"],
    "warningColor": colors.orange["600"],
    "warningColorPressed": colors.orange["600"],
    "warningColorHover": colors.orange["700"],
    "warningColorSuppl": colors.orange["600"],
    "errorColor": colors.red["600"],
    "errorColorPressed": colors.red["600"],
    "errorColorHover": colors.red["700"],
    "errorColorSuppl": colors.red["600"],
    "textColorBase": colors.blueGray["300"],
    "textColor1": colors.blueGray["400"],
    "textColor2": colors.blueGray["300"],
    "textColor3": colors.blueGray["200"],
    "textColorDisabled": colors.blueGray["400"],
    "placeholderColor": colors.blueGray["400"],
    "avatarColor": colors.blueGray["800"],
    "hoverColor": colors.blueGray["600"],
    "pressedColor": colors.blueGray["600"],
    "boxShadow2": theme.boxShadow.DEFAULT,
    "boxShadow3": theme.boxShadow.md,
    "boxShadow1": theme.boxShadow.sm,
    "fontSizeLarge": "16px",
    "fontSizeHuge": "18px",
    "baseColor": colors.blueGray["300"],
    "borderRadius": "4px",
    "borderColor": colors.blueGray["600"],
    "dividerColor": colors.blueGray["600"],
    "heightMedium": "38px",
    "heightLarge": "42px",
    "popoverColor": colors.blueGray["700"],
    "tableColor": colors.blueGray["800"],
    "cardColor": colors.blueGray["800"],
    "modalColor": colors.blueGray["800"],
    "bodyColor": colors.blueGray["900"],
    "tagColor": colors.blueGray["900"],
  },
  "Alert": {
    "iconSize": "24px",
    "iconMargin": "14px"
  },
  "Anchor": {
    "linkFontSize": "14px"
  },
  "Avatar": {
    "color": "rgba(230, 233, 244, 1)"
  },
  "Button": {
    "textColorPrimary": colors.blueGray["200"],
    "heightMedium": "38px",
    "heightLarge": "42px",
    "paddingMedium": "0 16px",
    "paddingLarge": "0 20px",
    "paddingTiny": "0 12px",
    "paddingSmall": "0 14px",
    "fontSizeLarge": "14px"
  },
  "Input": {
    "paddingLarge": "5px 16px",
    "paddingMedium": "0 14px",
    "paddingSmall": "0 12px",
    "fontSizeLarge": "14px",
    "borderHover": "1px solid " + colors.blue["600"],
    "borderFocus": "1px solid " + colors.blue["600"],
  },
  "InternalSelection": {
    "heightMedium": "38px",
    "heightLarge": "42px",
  },
  "Select": {
    "heightMedium": "38px",
    "heightLarge": "42px",
  },
  "Form": {
    "labelFontSizeLeftLarge": "16px",
    "labelPaddingVertical": "0 0 12px 2px",
    "feedbackPadding": "5px 0 15px 2px",
    "blankHeightMedium": "38px",
    "blankHeightLarge": "42px"
  },
  "Message": {
    "colorInfo": "#ECF2FFFF",
    "textColorInfo": colors.blue["600"],
    "boxShadowInfo": theme.boxShadow.sm,
    "boxShadowSuccess": theme.boxShadow.sm,
    "colorSuccess": "#DAF9ECFF",
    "colorWarning": "#FFF9E1FF",
    "colorError": "#FDE7EAFF",
    "colorLoading": "#ECF2FFFF",
    "textColorSuccess": colors.green["600"],
    "textColorError": colors.red["600"],
    "textColorWarning": colors.orange["600"],
    "textColorLoading": colors.blue["600"],
    "boxShadowError": theme.boxShadow.sm,
    "boxShadowWarning": theme.boxShadow.sm,
    "boxShadowLoading": theme.boxShadow.sm,
    "loadingColor": colors.blue["600"]
  },
  "Card": {
    "paddingSmall": "14px",
    "paddingMedium": "20px",
    "paddingLarge": "24px",
    "paddingHuge": "28px",
    "boxShadow": "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)",
    "borderColor": colors.blueGray["200"],
  },
  "DataTable": {
    "borderColor": colors.blueGray["600"],
    "tdColor": colors.blueGray["800"],
    "tdColorHover": colors.blueGray["700"],
    "thColor": colors.blueGray["800"],
    "thColorHover": colors.blueGray["700"],
    "thPaddingLarge": "14px",
    "thPaddingMedium": "14px",
    "thPaddingSmall": "10px",
    "tdPaddingSmall": "10px",
    "tdPaddingMedium": "14px",
    "tdPaddingLarge": "14px",
    "fontSizeLarge": "14px"
  },
  "DatePicker": {},
  "Switch": {},
  "Pagination": {
    "itemSize": "38px"
  },
  "Tree": {
    "nodeColorHover": "rgba(0,0,0, 0)",
    "nodeColorActive": colors.blueGray["700"]
  }
}
