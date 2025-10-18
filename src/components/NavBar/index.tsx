'use client';
import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

type Items = {
	name: string;
	link: string;
};

const navItems: Items[] = [
	{
		link: '/',
		name: 'Home',
	},
	{
		link: '/documentation',
		name: 'Documentation',
	},
	{
		link: '/test-coverage',
		name: 'Test Coverage',
	},
];

const NavBar = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();
	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};
	const redirectTo = (link: string) => () => {
		router.push(link);
	};

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography variant='h6' sx={{ my: 2 }}>
				MUI
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item.link} disablePadding>
						<ListItemButton
							onClick={redirectTo(item.link)}
							sx={{ textAlign: 'center' }}
						>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
	return (
		<>
			<AppBar component='nav'>
				<Toolbar className='bg-white text-gray-700'>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
					>
						MUI
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button onClick={redirectTo(item.link)} key={item.link}>
								{item.name}
							</Button>
						))}
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</nav>
		</>
	);
};

export default NavBar;
