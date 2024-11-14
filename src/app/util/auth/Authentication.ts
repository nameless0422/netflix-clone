interface User {
    id: string;
    password: string;
  }
  
  const tryLogin = (
    email: string,
    password: string,
    success: (user: User) => void,
    fail: () => void,
    saveToken: boolean = true
  ): void => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  
    const user = users.find(user => user.id === email && user.password === password);
  
    if (user) {
      if (saveToken) {
        localStorage.setItem('TMDb-Key', user.password);
      }
      success(user);
    } else {
      fail();
    }
  };
  
  const tryRegister = (
    email: string,
    password: string,
    success: () => void,
    fail: (error?: Error) => void
  ): void => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(existingUser => existingUser.id === email);
  
      if (userExists) {
        throw new Error('User already exists');
      }
  
      const newUser: User = { id: email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      success();
    } catch (err) {
      fail(err instanceof Error ? err : new Error('Unknown error'));
    }
  };
  
  export { tryLogin, tryRegister };
  