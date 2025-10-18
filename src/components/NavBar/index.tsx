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
import Link from 'next/link';

const drawerWidth = 240;

type Items = {
	name: string;
	link: string;
};

const navItems: Items[] = [
	{
		link: 'https://github.com/MWalter777/finnhub-stock?tab=readme-ov-file#getting-started',
		name: 'documentation',
	},
	{
		link: 'https://raw.githubusercontent.com/MWalter777/finnhub-stock/master/code-coverage-2025-10-18.png',
		name: 'test-coverage',
	},
];

const NavBar = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
			<Typography variant='h6' sx={{ my: 2 }}>
				<Link href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
					Finnhub stock
				</Link>
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item.link} disablePadding>
						<ListItemButton sx={{ textAlign: 'center' }}>
							<a href={item.link} target='_blank' rel='noopener noreferrer'>
								<ListItemText primary={item.name} />
							</a>
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
						<Link href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
							Finnhub stock
						</Link>
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button key={item.link}>
								<a href={item.link} target='_blank' rel='noopener noreferrer'>
									{item.name}
								</a>
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
