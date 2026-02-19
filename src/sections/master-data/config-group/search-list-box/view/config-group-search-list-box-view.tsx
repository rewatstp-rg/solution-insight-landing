import { Box, Container } from "@mui/material";

import { paths } from 'src/routes/paths';
import { useRouter } from "src/routes/hooks";

import { useAppSelector } from "src/store/hooks";
import { selectMasterData } from "src/slices/master-data.slices";

import { useSettingsContext } from "src/components/settings";
import { ButtonSubmitForm } from "src/components/button-forom";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";

import ListboxForm from "../listbox-form";
import ConfigGroupForm from "../config-group-form";

type Props = {
    type: string;
    listboxGroup: string;
};

const ConfigGroupSearchListBoxView = ({ type, listboxGroup }: Props) => {

    const isAdd = () => type === 'add';

    const router = useRouter();
    const settings = useSettingsContext();

    const { configGroupDetail } = useAppSelector(selectMasterData);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="ข้อมูล Config Group"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Config Group', href: paths.masterData.configGroup },
                    { name: isAdd() ? 'เพิ่ม Config Group' : listboxGroup },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ConfigGroupForm type={type} listboxGroup={listboxGroup} configGroupDetail={configGroupDetail} />
            {
                !isAdd() && (
                    <ListboxForm listboxGroup={listboxGroup} type={type} />
                )
            }

            <Box
                rowGap={1}
                columnGap={6}
                mt={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                    lg: 'repeat(1, 1fr)',
                }}
            >
                <ButtonSubmitForm
                    isSubmit={false}
                    cancelLabel='กลับ'
                    onCancel={() => router.back()}
                />
            </Box>
        </Container>
    )
};

export default ConfigGroupSearchListBoxView;
