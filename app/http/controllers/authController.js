const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
// factory functions
const authController = () => {
  return {

    login(req, res) {
      res.render("auth/login.ejs");
    },


    postLogin(req, res, next) {

          const {email, password } = req.body;
          // console.log(req.body);

          //validate request
          if (!email || !password) {
            req.flash("error", "All field are required");
            return res.redirect("/login");
          }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.rerdirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },


    register(req, res) {
      res.render("auth/register.ejs");
    },


    async postRegister(req, res) {

          const { name, email, password } = req.body;
          // console.log(req.body);

          //validate request
          if (!name || !email || !password) {
            req.flash("error", "All field are required");
            req.flash("name", name);
            req.flash("email", email);

            return res.redirect("/register");
          }
          // check if email exists
          User.exists({ email: email }, (err, result) => {
            if (result) {
              req.flash("error", "Email already taken");
              req.flash("name", name);
              req.flash("email", email);

              return res.redirect("/register");
            }
          });

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // create user
          let user = new User({
            name: name,
            email: email,
            password: hashedPassword,
          });

          user
            .save()
            .then((user) => {
              console.log(user);
              res.redirect("/");
            })
            .catch((err) => {
              req.flash("error", "some thing went wrong");
              return res.redirect("/register");
            });

    },

    logout(req,res){
      req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect("/");
      });
    }

  };
};

module.exports = authController;
