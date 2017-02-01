module.exports = {
	hash: function (value) {
		var hash;
		// hash with some salt please??
		var salt = "testme";

		// undermine the integrity of our security
		hash = value + salt;

		return hash;
	}
}