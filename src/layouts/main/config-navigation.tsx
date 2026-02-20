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
      "subHeader": "สินค้า",
      "subHeaderEn": "สินค้า",
      "items": [
        {
          "title": "ตรวจสอบสินค้า",
          "titleEn": "ตรวจสอบสินค้า",
          "path": "/module/product",
          "icon": "ic_file",
          "view": true,
          "add": true,
          "update": true,
          "inactive": true,
          "perform": true,
          "id": "MN026"
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
