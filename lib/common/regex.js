/**
 * @module regex 
 * @description 正则匹配常量
 */

 module.exports = {
     GET_SCRIPT: /<script(([\s\S])*?)<\/script>/g,
     GET_TEMPLATE: /<template(([\s\S])*?)<\/template>/g,
     GET_SCRIPT_SRC: /<script [^>]*src=['"]([^'"]+)[^>]*>/gi,
     IS_VUE_FILE: /.*.vue$/gi,
     TO_KEBAB_CASE: /[a-z]+|[A-Z][a-z]*/g,
     IS_PUG_TEMPLETE: /<template.*pug.*>/gi,
     GLOBAL_MATCH_PUG: '\\n\\s*',
     GLOBAL_MATCH_NORMAL: '<\\s*'
 }
