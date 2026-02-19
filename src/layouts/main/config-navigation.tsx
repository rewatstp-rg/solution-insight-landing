// import { useMemo } from 'react';

import { NavItemBaseProps } from 'src/components/mega-menu';

// import { useAppSelector } from 'src/store/hooks';
// import { selectAuthMenu } from 'src/slices/menu.slices';

// ----------------------------------------------------------------------

const listMenuMockUp: {
  subHeader: string;
  subHeaderEn: string;
  items: NavItemBaseProps[];
}[] = [
    {
      "subHeader": "Dashboard",
      "subHeaderEn": "Dashboard",
      "items": [
        {
          "title": "Overview",
          "titleEn": "Overview",
          "path": "/dashboard/overview",
          "icon": "ic_dashboard",
          "view": true,
          "add": true,
          "update": true,
          "inactive": true,
          "perform": true,
          "id": "MN034"
        },
      ]
    },
    {
      "subHeader": "Email marketing",
      "subHeaderEn": "Email marketing",
      "items": [
        {
          "title": "Email template",
          "titleEn": "Event",
          "path": "/email/template",
          "icon": "ic_file",
          "view": true,
          "add": true,
          "update": true,
          "inactive": true,
          "perform": true,
          "id": "MN026"
        },
        {
          "title": "Email transaction",
          "titleEn": "Event",
          "path": "/email/transaction",
          "icon": "ic_file",
          "view": true,
          "add": true,
          "update": true,
          "inactive": true,
          "perform": true,
          "id": "MN027"
        }
      ]
    },
    {
      "subHeader": "ผู้ดูแลระบบ",
      "subHeaderEn": "System Administrator",
      "items": [
        {
          "title": "ข้อมูลผู้ดูแลระบบ",
          "titleEn": "System Administrator Information",
          "path": "/administrator",
          "icon": "ic_shield-user",
          "view": true,
          "add": true,
          "update": true,
          "inactive": true,
          "perform": true,
          "id": "MN005"
        }
      ]
    }
  ]

export function useNavData() {

  // const { listAllMenu } = useAppSelector(selectAuthMenu);

  // const data = useMemo(
  //   () => listAllMenu,
  //   [listAllMenu]
  // );

  return listMenuMockUp;
};
