var sha256             = require('js-sha256');
const SUPER_SECRET_SALT = "Accordingtoallknownlawsofaviation,thereisnowayabeeshouldbeabletofly.Itswingsaretoosmalltogetitsfalittlebodyofftheground,Thebee,ofcourse,fliesanywaybecausebeesdon'tcarewhathumansthinkisimpossibe.Yellow,black.Yellow,black.Yellow,black.Yellow,black.Ooh,blackandyellow!Let'sshakeitupalittle.Barry!Breakfastisready!Ooming!Hangonasecond.Hello?-Barry?-Adam?-Oanyoubelievethisishappening?-Ican't.I'llpickyouup.Lookingsharp.Usethestairs.Yourfatherpaidgoodmoneyforthose.Sorry.I'mexcited.Here'sthegraduate.We'reveryproudofyou,son.Aperfectreportcard,allB's.Veryproud.Ma!Igotathinggoinghere.-Yougotlintonyourfuzz.-Ow!That'sme!-Wavetous!We'llbeinrow118,000.-Bye!Barry,Itoldyou,stopflyinginthehouse!-Hey,Adam.-Hey,Barry.-Isthatfuzzgel?-Alittle.Specialday,graduation.NeverthoughtI'dmakeit";

module.exports = {
	hash: function (pass, email) {
		return sha256(pass + SUPER_SECRET_SALT + email);
	}
}