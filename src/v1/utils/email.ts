const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function isEmailValid(email: string): boolean {
	if (!email){
		return false;
	}

	if(email.length>254){ // Email cannot be longer than 254 characters
		return false;
	}

	var valid = emailRegex.test(email); // Test against the emailRegex pattern

	if(!valid){
		return false;
	}

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64){ // Email address cannot be longer than 64 characters
		return false;
	}

	var domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; })){ // Domain cannot be longer than 63 chars
		return false;
	}

	return true;
}