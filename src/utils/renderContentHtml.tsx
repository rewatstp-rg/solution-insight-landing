import { Box } from "@mui/material";

type Props = {
    message: string;
    sx?: any;
    style?: any;
}

const RenderContentHtml = ({ message, sx, style }: Props) => (
    <Box
        {...sx}
        style={style}
        dangerouslySetInnerHTML={{ __html: message }}
        sx={{
            mb: 0.5,
            '& p': { typography: 'body2', m: 0 },
            '& a': { color: 'inherit', textDecoration: 'none' },
            '& strong': { typography: 'subtitle2' },
        }}
    />
);

export default RenderContentHtml;