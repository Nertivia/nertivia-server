import fs from 'fs';
import validTlds from '../../validTlds';
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export async function isEmailValid(email: string): Promise<boolean> {
	if (!email){
		console.log("email is empty");
		return false;
	}

	if(email.length>254){ // Email cannot be longer than 254 characters
		console.log("email is too long");
		return false;
	}

	var valid = emailRegex.test(email); // Test against the emailRegex pattern

	if(!valid){
		console.log("email is not valid");
		return false;
	}

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64){ // Email address cannot be longer than 64 characters
		console.log("email is too long2");
		return false;
	}

	var domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; })){ // Domain cannot be longer than 63 chars
		console.log("email is too long3");
		return false;
	}
	if(!validTlds.includes(domainParts[domainParts.length - 1].toUpperCase())){ // Check that the TLD is valid
		console.log(validTlds)
		console.log("email is not valid2");
		return false;
	}

	return true;
}