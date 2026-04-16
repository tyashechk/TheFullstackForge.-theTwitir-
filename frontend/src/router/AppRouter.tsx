import { Route, Routes } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout/MainLayout';
import Home from '@/pages/Home/Home';
import Users from '@/pages/Users/Users';      // ← добавить импорт
import About from '@/pages/About/About';
import NotFound from '@/pages/NotFound/NotFound';
import Login from '@/pages/Login/Login';

const AppRouter = () => {
    return <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="users" element={<Users />} />   // ← добавить маршрут
            <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
};

export default AppRouter;