import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Chart } from "./Chart";
import { BarSeriesOption, EChartsOption } from "echarts";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type Values<T> = T[keyof T];

export default function App() {

    const [page, setPage] = useState(0);

    const [{trend, shortFactors, markets, products}, setState] = useState({
        trend: 'short',
        shortFactors: ['money', 'quantity', 'value'],
        markets: ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 4', 'Рынок 6', 'Рынок 7'],
        products: ['Продукт 1', 'Продукт 2', 'Продукт 3', 'Продукт 4']
    })


    let rawData: number[][] = [
        [830, 902, 910, 944, 1490, 1530, 1550],
        [824, 893, 903, 935, 1345, 1456, 1458],
        [820, 832, 901, 934, 1290, 1330, 1320],
        [150, 212, 201, 154, 190, 330, 410],
        [220, 182, 191, 234, 290, 330, 310],
        [100, 302, 301, 334, 390, 330, 320],
        [320, 132, 101, 134, 90, 230, 210],
    ];
    if (trend === 'short' && shortFactors.length && shortFactors.length < 3) {
        rawData.forEach((item, index) => {
            const j = Math.floor(Math.random() * (index + 1));
            const temp = rawData[index];
            rawData[index] = rawData[j];
            rawData[j] = temp;
        });
    }

    const totalData: number[] = [];
    for (let i = 0; i < rawData[0].length; ++i) {
        let sum = 0;
        for (let j = 0; j < rawData.length; ++j) {
            sum += rawData[j][i];
        }
        totalData.push(sum);
    }
    const grid = {
        left: 100,
        right: 100,
        top: 50,
        bottom: 50
    };
    const series: Values<BarSeriesOption> & { name: string; }[] = [
        {name: 'Канал 1   ', color: '#03a577',},
        {name: 'Канал 2', color: '#f06e2d',},
        {name: 'Канал 3', color: '#204188',},
        {name: 'Канал 4', color: '#ffb500',},
        {name: 'Канал 5', color: '#cb4b7a',},
        {name: 'Канал 6', color: '#4697e2',},
        {name: 'Канал 7', color: '#675895',},
    ].map(({name, color}, sid) => {
        return {
            name,
            type: 'bar' as const,
            stack: 'total',
            barWidth: '80%',
            label: {
                show: true,
                formatter: (params: { value: number; }) => Math.round(params.value * 1000) / 10 + '%'
            },
            data: rawData[sid].map((d, did) =>
                totalData[did] <= 0 ? 0 : d / totalData[did]
            ),
            color,
            barGap: sid === 0 || sid === 1 ? '-20%' : undefined,
        }
    });


    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: {value},
        } = event;
        // @ts-ignore
        setState(prevState => ({
            ...prevState,
            shortFactors: value === 'string' ? value.split(',') : value ?? [],
        }));
    };

    const handleChangeMarkets = (event: SelectChangeEvent<string[]>) => {
        const {
            target: {value},
        } = event;
        // @ts-ignore
        setState(prevState => ({
            ...prevState,
            markets: value === 'string' ? value.split(',') : value ?? [],
        }));
    };

    const handleChangeProducts = (event: SelectChangeEvent<string[]>) => {
        const {
            target: {value},
        } = event;
        // @ts-ignore
        setState(prevState => ({
            ...prevState,
            products: value === 'string' ? value.split(',') : value ?? [],
        }));
    };

    const handleChangeA = (event: SelectChangeEvent<string>) => {
        const {
            target: {value},
        } = event;
        setState(prevState => ({
            ...prevState,
            trend: value,
        }));
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const option: EChartsOption = {
        legend: {
            icon: 'square',
            type: 'scroll',
            selectedMode: false,
            orient: 'vertical',
            right: -10,
            top: 'center',
            width: 'auto',
            data: [...series].reverse().map(({name}) => ({
                name,
                icon: 'square'
            }))
        },
        grid,
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (val: number) => `${val * 100}`
            }
        },
        xAxis: {
            type: 'category',
            data: trend === 'long' ? ['Янв24', 'Фев24', 'Март24', 'Апр24', 'Май24', 'Июнь24', 'Июль24'] : ['2022', '2023', '2024']
        },
        series
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={false}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                             BI Module DEMO
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={false}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                    </Toolbar>
                    <Divider/>
                    <List component="nav">
                        <ListItemButton
                            onClick={() => setPage(0)}
                            style={{
                                backgroundColor: page === 0 ? '#1976d2' : undefined,
                                color: page === 0 ? '#fff' : undefined,
                            }}
                        >
                            <ListItemIcon>
                                <DashboardIcon style={{
                                    backgroundColor: page === 0 ? '#1976d2' : undefined,
                                    color: page === 0 ? '#fff' : undefined,
                                }}/>
                            </ListItemIcon>
                            <ListItemText primary="Reports"/>
                        </ListItemButton>
                        <ListItemButton
                            onClick={() => setPage(1)}
                            style={{
                                backgroundColor: page === 1 ? '#1976d2' : undefined,
                                color: page === 1 ? '#fff' : undefined,
                            }}
                        >
                            <ListItemIcon >
                                <BarChartIcon style={{
                                    backgroundColor: page === 1 ? '#1976d2' : undefined,
                                    color: page === 1 ? '#fff' : undefined,
                                    transform: 'rotate(90deg)'
                                }}/>
                            </ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItemButton>
                        <Divider sx={{my: 1}}/>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    {page === 0 && (
                        <Container maxWidth="xl">
                            <Box sx={{my: 4}}>
                                <Typography variant="h5" component="h1" sx={{mb: 2}}>
                                    Структура продаж в разрезе рынков и каналов и ее изменение
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <FormControl sx={{m: 1, width: 300}}>
                                        <InputLabel id="demo-multiple-name-label">Тренд</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            name={'trend'}
                                            value={trend}
                                            onChange={handleChangeA}
                                            input={<OutlinedInput label="Тренд"/>}
                                            MenuProps={MenuProps}
                                            defaultValue={'short'}
                                        >
                                            {[
                                                {value: 'short', name: 'Короткий тренд'},
                                                {value: 'long', name: 'Длинный тренд'},
                                            ].map(({name, value}) => (
                                                <MenuItem
                                                    key={name}
                                                    value={value}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {trend === 'short' && (

                                        <FormControl sx={{m: 1, width: 300}}>
                                            <InputLabel id="demo-multiple-name-label">Фактор</InputLabel>
                                            <Select
                                                labelId="demo-multiple-name-label"
                                                id="demo-multiple-name"
                                                name={'shortFactors'}
                                                multiple
                                                value={shortFactors}
                                                onChange={handleChange}
                                                input={<OutlinedInput label="Name"/>}
                                                MenuProps={MenuProps}
                                            >
                                                {[
                                                    {value: 'money', name: 'Деньги'},
                                                    {value: 'quantity', name: 'Штуки'},
                                                    {value: 'value', name: 'Объем'},
                                                ].map(({name, value}) => (
                                                    <MenuItem
                                                        key={name}
                                                        value={value}
                                                    >
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </form>
                            </Box>
                            <Chart
                                clustering
                                option={option}
                            />
                        </Container>
                    )}
                    {page === 1 && (
                        <Container maxWidth="xl">
                            <Box sx={{my: 4}}>
                                <Typography variant="h5" component="h1" sx={{mb: 2}}>
                                    Факторы, влияющие на развитие рынков и каналов
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <FormControl sx={{m: 1, width: 300}}>
                                        <InputLabel id="demo-multiple-name-label">Рынки</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            name={'markets'}
                                            multiple
                                            value={markets}
                                            onChange={handleChangeMarkets}
                                            input={<OutlinedInput label="Name"/>}
                                            MenuProps={MenuProps}
                                        >
                                            {['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 5', 'Рынок 6', 'Рынок 7'].map(value => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: 300}}>
                                        <InputLabel id="demo-multiple-name-label">Продукт</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            name={'products'}
                                            multiple
                                            value={products}
                                            onChange={handleChangeProducts}
                                            input={<OutlinedInput label="Name"/>}
                                            MenuProps={MenuProps}
                                        >
                                            {['Продукт 1', 'Продукт 2', 'Продукт 3', 'Продукт 4'].map(value => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </form>
                            </Box>
                            <Chart
                                clustering
                                option={{
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        }
                                    },
                                    legend: {
                                        data: products.length ? products : ['Продукт 1', 'Продукт 2', 'Продукт 3', 'Продукт 4'],
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    xAxis: [
                                        {
                                            type: 'value'
                                        }
                                    ],
                                    yAxis: [
                                        {
                                            type: 'category',
                                            axisTick: {
                                                show: false
                                            },
                                            data: markets.length ? markets.sort() : ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 5', 'Рынок 6', 'Рынок 7']
                                        }
                                    ],
                                    series: [
                                        {
                                            name: 'Продукт 1',
                                            type: 'bar',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            emphasis: {
                                                focus: 'series'
                                            },
                                            data: markets.length ? ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 4', 'Рынок 6', 'Рынок 7'].reduce((result, item, index) => {
                                                if (markets.includes(item)) {
                                                    // @ts-ignore
                                                    result.push([-100, -70, -140, -144, -100, -120, -110].at(index));
                                                }
                                                return result;
                                            }, []) : [-100, -70, -140, -144, -100, -120, -110],
                                            color: '#7abd33',
                                            stack: 'Total'
                                        },
                                        {
                                            name: 'Продукт 2',
                                            type: 'bar',
                                            label: {
                                                show: true,
                                                position: 'inside'
                                            },
                                            emphasis: {
                                                focus: 'series'
                                            },
                                            data: markets.length ? ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 4', 'Рынок 6', 'Рынок 7'].reduce((result, item, index) => {
                                                if (markets.includes(item)) {
                                                    // @ts-ignore
                                                    result.push([200, 170, 240, -244, 200, 220, 210].at(index));
                                                }
                                                return result;
                                            }, []) : [200, 170, 240, -244, 200, 220, 210],
                                            stack: 'Total',
                                            color: '#f27f45',
                                        },
                                        {
                                            name: 'Продукт 3',
                                            type: 'bar',
                                            stack: 'Total',
                                            label: {
                                                show: true
                                            },
                                            emphasis: {
                                                focus: 'series'
                                            },
                                            data: markets.length ? ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 4', 'Рынок 6', 'Рынок 7'].reduce((result, item, index) => {
                                                if (markets.includes(item)) {
                                                    // @ts-ignore
                                                    result.push([320, 302, -341, 374, 390, 450, 420].at(index));
                                                }
                                                return result;
                                            }, []) : [320, 302, -341, 374, 390, 450, 420],
                                        },
                                        {
                                            name: 'Продукт 4',
                                            type: 'bar',
                                            stack: 'Total',
                                            label: {
                                                show: true,
                                                position: 'left'
                                            },
                                            emphasis: {
                                                focus: 'series'
                                            },
                                            data: markets.length ? ['Рынок 1', 'Рынок 2', 'Рынок 3', 'Рынок 4', 'Рынок 4', 'Рынок 6', 'Рынок 7'].reduce((result, item, index) => {
                                                if (markets.includes(item)) {
                                                    // @ts-ignore
                                                    result.push([-120, -132, -101, -134, -190, -230, -210].at(index));
                                                }
                                                return result;
                                            }, []) : [-120, -132, -101, -134, -190, -230, -210],
                                            color: '#2ab2d9'
                                        }
                                    ].filter(({ name }) => {
                                        console.log(name);
                                        console.log(products);
                                        return !products.length || products.includes(name)
                                    }) as any
                                }}
                            />
                        </Container>
                    )}
                    <Typography variant="body2" color="text.secondary" align="center">
                        {"Copyright © "}
                        <Link color="inherit" href="#">
                            BI
                        </Link>{" "}
                        {new Date().getFullYear()}.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>

    );
}
