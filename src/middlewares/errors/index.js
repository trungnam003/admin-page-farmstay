// app.get('/', (req, res, next) => {
//   res.locals.noRenderHeader = true
//   res.render('home')
// });



// app.post('/', (req, res, next) => {
//   if(req.body.password == '123'){
//     next(new HttpError404())
//   }else{
//     res.json(req.body)
//   }
  
// });
const {HttpError, HttpError404} = require('../../utils/errors')
  
function handleHttpErrorDefault(err, req, res, next){
    if(err instanceof HttpError){
      if(err.statusCode == 401){
        res.status(302).redirect('/auth/login')
        return;
      }
      res.locals.noRenderHeader = true
      res.status(err.statusCode).render(`pages/errors/${err.statusCode+'_'+err.nameError}`,);
      return;
    }else{
      next(err);
      return;
    }
    res.status(500).json("err")
}

const listArrayHandleError = [handleHttpErrorDefault, ];
module.exports = listArrayHandleError
