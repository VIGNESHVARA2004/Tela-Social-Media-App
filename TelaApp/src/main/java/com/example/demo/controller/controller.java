package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.UserDaoService;
import com.example.demo.user.users;

@RestController
@CrossOrigin
public class controller {
	@Autowired
	UserDaoService ob;
	
	@GetMapping("/get")
	public Iterable<users> getDetails()
	{
		System.out.println("Got All the Details of Employees");
		return ob.get();
	}
	
	@GetMapping("/get/{username}")
	public String getByUserName(@PathVariable String username)
	{
		return ob.getByUserName(username);
	}
	
	@DeleteMapping("/delete/{username}")
	public String deleteDetails(@PathVariable String username)
	{
		ob.deleteUserByUsername(username);
		return "username : "+username+" deleted SuccessFully!";
	}
	
	@PostMapping("/post")
	public String postDetails(@RequestBody users d)
	{
		ob.post(d);
		return "Employee Details Saved SuccessFully!";
	}
	
	@PutMapping("/put/{id}")
	public String updateEmployees(@RequestBody users b)
	{
		ob.update(b);
		return "Changes Made Successfully!";
	}
}
