package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.UserRepository;
import com.example.demo.user.users;

@Service
public class UserDaoService {
	@Autowired
	UserRepository users;
	
	public Iterable<users> get()
	{
		return users.findAll();
	}
	
	public void deleteUserByUsername(String username) {
        users.deleteByUserName(username);
	}
	
	public String getByUserName(String username) {
		users user = users.getByUserName(username);
		return user.getPassword();
	}
	
	public void update(users user)
	{
		users.save(user);
	}
	public void post(users user)
	{
		users.save(user);
	}
}
