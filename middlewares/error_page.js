/**
 * Created by yangxiaoyang on 2017/2/20.
 */
exports.errorPage = function(req,res,next){
    res.render404 = function(error){
        return res.status(404).render('404',{page:{title:'页面找不到啦'},layout: false});
    };
    res.renderError = function(error,statusCode){
        if(statusCode ===undefined){
            statusCode = 400;
        }
        return res.status(statusCode).render('404',{
            page:{title:'页面找不到啦'},
            layout: false
        });
    };
    next();
};