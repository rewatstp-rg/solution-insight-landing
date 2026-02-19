import { useState, useEffect } from 'react';

import { Container } from "@mui/material";

import { paths } from 'src/routes/paths';

import { MASTER_CONFIG_GROUP } from 'src/utils/constants';
import { checkServiceResponse } from 'src/utils/check-service-response';
import { enqueueSnackbarErrorComponent } from 'src/utils/enqueueSnackbarComponent';

import { useAppDispatch } from 'src/store/hooks';
import { setLoadingState } from 'src/slices/error-message.slices';
import { useGetConfigByGroupMutation } from 'src/api/master-data.api';
import { useGetByEmailTemplateCodeMutation } from 'src/api/email-marketing.api';

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { Config } from 'src/types/master-config';
import { EmailMktTemplateType, DefaultValueEmailMktTemplateType } from 'src/types/email-mkt-template.type';

import EditorMain from '../editor-main';

// ----------------------------------------------------------------------

const {
    EMAIL_TEMPLATE_STATUS
} = MASTER_CONFIG_GROUP;

type Props = {
    id: string;
    type: string;
};

// ----------------------------------------------------------------------

export default function EmailEditorFormView({ id, type }: Props) {

    const isAdd = () => type === 'add';

    const dispatch = useAppDispatch();

    const [getConfigOption] = useGetConfigByGroupMutation();
    const [updateEmailTemplate] = useGetByEmailTemplateCodeMutation();

    const [emailMktTemplateDetail, setEmailMktTemplateDetail] = useState<EmailMktTemplateType>(DefaultValueEmailMktTemplateType);

    const getEmailTemplateStatusOption = async () => {
        const body: Config = {
            listboxGroup: EMAIL_TEMPLATE_STATUS,
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const listOption = async () => {
        await getEmailTemplateStatusOption();
    }

    const loadContent = async () => {
        listOption();
        if (id) {
            dispatch(setLoadingState(true));
            const emailModel: EmailMktTemplateType = {
                ...DefaultValueEmailMktTemplateType,
                emailTemplateCode: id
            }
            await updateEmailTemplate(emailModel).unwrap().then((res) => {
                if (checkServiceResponse(res)) {
                    const { data } = res;
                    setEmailMktTemplateDetail(data);
                    dispatch(setLoadingState(false));
                } else {
                    enqueueSnackbarErrorComponent();
                    dispatch(setLoadingState(false));
                }
            });
        }
    }

    useEffect(() => {
        loadContent();
        return () => {

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <Container maxWidth='xl'>
            <CustomBreadcrumbs
                heading="Email template"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Editor' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            {
                (emailMktTemplateDetail.id && !isAdd())  ? <EditorMain emailMktTemplateDetail={emailMktTemplateDetail} type={type} /> : null
            }

            {
                (isAdd()) ? <EditorMain emailMktTemplateDetail={DefaultValueEmailMktTemplateType} type={type} /> : null
            }

        </Container>
    )
}