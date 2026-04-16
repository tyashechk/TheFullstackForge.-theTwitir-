import { useEffect, useState } from 'react';
import { userController } from '@/services/api/controllers/user-controller';
import { getDefaultPageable } from '@/types/common/pageable.type';
import './Users.scss';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUserId(parseInt(userId));
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
            console.log(`✅ Подписались на ${username}`);
            alert(`Вы подписались на ${username}`);
        } catch (error) {
            console.error(`❌ Ошибка подписки:`, error);
            alert(`Не удалось подписаться на ${username}`);
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
                                
                                return (
                                    <li key={user.id}>
                                        {user.username}
                                        <button
                                            className='btn-subscribe'
                                            onClick={() => handleSubscribe(user.id, user.username)}
                                        >
                                            Подписаться
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