import { Card, CardHeader, CardContent } from '@mui/material';

type Props = {
    children: React.ReactNode;
    title?: string | React.ReactNode;
    action?: React.ReactNode;
}

export default function CardCustom({ children, title, action }: Props) {
    return (
        <Card sx={{
            width: '100%',
            mb: 4
        }}>
            {
                title && (
                    <>
                        <CardHeader title={title} action={action} sx={{
                            borderWidth: '0px 0px 3px',
                            borderStyle: 'solid',
                            borderColor: 'primary.main',
                            pb: 2,
                            pt: 2
                        }} />
                        <CardContent>
                            {children}
                        </CardContent>
                    </>

                )
            }
            {
                !title && (
                    <CardContent>
                        {children}
                    </CardContent>
                )
            }

        </Card >
    )
}