import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const calculateTotalPostOfEveryUser = (posts) => {
  const postCountByUser = {};
  for (const post of posts) {
    const userId = post.userId;

    if (userId in postCountByUser) {
      postCountByUser[userId]++;
    } else {
      postCountByUser[userId] = 1;
    }
  }

  return postCountByUser;
};

function App() {
  const [postCount, setPostCount] = useState([]);

  const callPostAPI = async () => {
    try {
      const post = await axios.get('https://jsonplaceholder.typicode.com/posts');
      return post.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  const callUserAPI = async () => {
    try {
      const user = await axios.get('https://jsonplaceholder.typicode.com/users');
      return user.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const posts = await callPostAPI();
      const users = await callUserAPI();
      if (posts && users) {
        const postCountByUser = calculateTotalPostOfEveryUser(posts);

        const usersWithPostCount = users.map((user) => ({
          ...user,
          postCount: postCountByUser[user.id] || 0,
        }));

        setPostCount(usersWithPostCount);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Post Count</th>
          </tr>
        </thead>
        <tbody>
          {postCount?.map(({ id, name, postCount }, i) => (
            <tr key={i}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
