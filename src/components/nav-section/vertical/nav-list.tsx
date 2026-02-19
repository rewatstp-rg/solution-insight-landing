import { useState, useEffect, useCallback } from 'react';

import Collapse from '@mui/material/Collapse';

import { ROOT_ADMIN } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';

import { localStorageGetItem } from 'src/utils/storage-available';

import SvgColor from 'src/components/svg-color';

import NavItem from './nav-item';
import { NavListProps, NavSubListProps } from '../types';

// ----------------------------------------------------------------------

export default function NavList({ data, depth, slotProps }: NavListProps) {

  const routerPath = ROOT_ADMIN;
  const pathname = usePathname();

  const langStorage = localStorageGetItem('i18nextLng');

  const active = useActiveLink(`${routerPath}${data.path}`, !!data.children);
  // const active = useActiveLink(`${data.path}`, !!data.children);

  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        //
        title={langStorage === 'th' ? data.title : (data?.titleEn || '')}
        path={`${routerPath}${data.path}`}
        icon={<SvgColor src={`/assets/icons/navbar/${data.icon}.svg`} sx={{ width: 1, height: 1 }} />}
        // path={data.path}
        // icon={data.icon}
        info={data.info}
        roles={data.roles}
        caption={data.caption}
        disabled={data.disabled}
        //
        depth={depth}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        currentRole={slotProps?.currentRole}
        //
        active={active}
        className={active ? 'active' : ''}
        sx={{
          mb: `${slotProps?.gap}px`,
          ...(depth === 1 ? slotProps?.rootItem : slotProps?.subItem),
        }}
      />

      {!!data.children && (
        <Collapse in={openMenu} unmountOnExit>
          <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, depth, slotProps }: NavSubListProps) {
  return (
    <>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </>
  );
}
