package com.example.demo.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.user.users;

public interface UserRepository extends CrudRepository<users,Integer>{
	
	@Transactional
	@Modifying
    @Query("DELETE FROM users WHERE username = :username")
	public void deleteByUserName(@Param("username")String username);
	
	@Query("select u From users u WHERE u.username = :username")
	public users getByUserName(@Param("username") String username);
}
