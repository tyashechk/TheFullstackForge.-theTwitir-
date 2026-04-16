import { useEffect, useState } from 'react';
import { userController } from '@/services/api/controllers/user-controller';
import { getDefaultPageable } from '@/types/common/pageable.type';
import './Users.scss';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [subscribedIds, setSubscribedIds] = useState<Set<number>>(new Set());

    // Загрузка текущего пользователя и сохранённых подписок
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUserId(parseInt(userId));
        }
        
        // Загружаем подписки из localStorage
        const saved = localStorage.getItem('subscribedIds');
        if (saved) {
            setSubscribedIds(new Set(JSON.parse(saved)));
        }
    }, []);

    const fetchUsers = () => {
        const pageable = getDefaultPageable();
        userController.getUsers(pageable)
            .then(response => {
                setUsers(response.data.content);
                setLoading(false);
            })
            .catch(() => {
                setError('Ошибка загрузки пользователей');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubscribe = async (userId: number, username: string) => {
        try {
            await userController.subscribe(userId);
            const newIds = new Set(subscribedIds).add(userId);
            setSubscribedIds(newIds);
            localStorage.setItem('subscribedIds', JSON.stringify([...newIds]));
            console.log(`✅ Подписались на ${username}`);
        } catch (error) {
            console.error(`❌ Ошибка подписки:`, error);
            alert(`Не удалось подписаться на ${username}`);
        }
    };

    const handleUnsubscribe = async (userId: number, username: string) => {
        try {
            await userController.unsubscribe(userId);
            const newIds = new Set(subscribedIds);
            newIds.delete(userId);
            setSubscribedIds(newIds);
            localStorage.setItem('subscribedIds', JSON.stringify([...newIds]));
            console.log(`✅ Отписались от ${username}`);
        } catch (error) {
            console.error(`❌ Ошибка отписки:`, error);
            alert(`Не удалось отписаться от ${username}`);
        }
    };

    return (
        <div className="users-page">
            <div className="container">
                <h1>Пользователи</h1>
                
                {error && <div style={{ color: 'red' }}>{error}</div>}

                {loading ? (
                    <div>Загрузка...</div>
                ) : (
                    <ul>
                        {users.length !== 0 ? (
                            users.map((user) => {
                                if (user.id === currentUserId) {
                                    return (
                                        <li key={user.id}>
                                            {user.username} <span style={{ color: 'gray' }}>(это вы)</span>
                                        </li>
                                    );
                                }
                                
                                const isSubscribed = subscribedIds.has(user.id);
                                
                                return (
                                    <li key={user.id}>
                                        {user.username}
                                        <button
                                            className={isSubscribed ? 'btn-unsubscribe' : 'btn-subscribe'}
                                            onClick={() => {
                                                if (isSubscribed) {
                                                    handleUnsubscribe(user.id, user.username);
                                                } else {
                                                    handleSubscribe(user.id, user.username);
                                                }
                                            }}
                                        >
                                            {isSubscribed ? 'Отписаться' : 'Подписаться'}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li>Нет пользователей</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Users;