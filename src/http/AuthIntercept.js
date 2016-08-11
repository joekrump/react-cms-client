const AuthIntercept = require('superagent-intercept')((err, res, onFailureCB, onSuccessCB) => {
	if(err) {
    if(onFailureCB) {
    	onFailureCB()
    }
    
	} else if (res.statusCode !== 200) {
		console.log('Error in Post ', err, res)
	  if(onFailureCB) {
	  	onFailureCB();
	  }
	} else {
		 onSuccessCB();
	}
});

export default AuthIntercept