const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

app.use(express.static('../public'));
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use(bodyParser.text());

let grobal = {
  person: {
    name : '赵容',
    number: '201866481204'
  }
};

app.get('/operatorLogin', function (req, res) {
  let boolean = false;
  fs.readFile('password.txt', function (err, data) {
    if (!err) {
      if (data) {
        JSON.parse(data).map((item) => {
          if (item.number === req.query.number && item.password === req.query.password) {
            grobal.person.number = req.query.number;
            boolean = true;
          }
        })
        if (boolean) {
          res.status(200).send([{
            identity: "administrator",
            message: '用户名和密码正确'
          }]);
          return;
        } else {
          res.status(403).send([{
            message: '用户名和密码错误'
          }])
          return;
        }
      }
    }
  })
})

app.get('/insert', function (req, res) {
  // 正则的验证
  let user_arr = [];
  fs.readFile('data.json', 'utf-8', function(err, data) {
    if (data) user_arr = JSON.parse(data);
    let j;
    user_arr.map((item, index) => {
      if (item.number === req.query.number) {
        j = index;
      }
    })
    if (!j) {
      user_arr.push({
        name: req.query.name,
        number: req.query.number,
        tel: req.query.tel,
        department: req.query.department,
      });
      fs.writeFile('data.json', JSON.stringify(user_arr), function (err) {
        if (err) {
          console.log(err);
        }
      })
      let password_arr = [];
      fs.readFile('password.txt', 'utf-8', function (err, data) {
        if (!err) {
          if (data) password_arr = JSON.parse(data);
            password_arr.push({
              number: req.query.number,
              password: req.query.password
            })
          fs.writeFile('password.txt', JSON.stringify(password_arr), function (err) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).send([{
                message: '注册成功'
              }])
            }
          })
        } else {
          res.status(403).send([{
            message: '注册失败'
          }])
          return;
        }
      })
    } else {
      res.status(403).send([{
        message: '该学号已被注册!'
      }])
      return;
    }
  })
})

app.get('/forgetPassword', function (req, res) {
  let user_arr = [];
  let boolean = false;
  fs.readFile('password.txt', 'utf-8', function(err, data) {
    if (!err) {
      if(data) user_arr = JSON.parse(data);
      user_arr.map((item) => {
        if (item.number === req.query.number) {
          item.password = req.query.setPassword;
          boolean = true;
        }
      })
      fs.writeFile('password.txt', JSON.stringify(user_arr), function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('文件读取失败')
          return ;
        }
      })
      if (boolean) {
        res.status(200).send([{
          message: '找回密码成功!'
        }]);
        return;
      } else {
        res.status(403).send([{
          message: '找回密码失败!'
        }]);
        return;
      }
    } else {
      res.status(403).send([{
        message: '密码找回错误'
      }])
      return ;
    }
  })
})


// 注销接口


// 显示接口

app.get('/queryInitial', function (req, res) {
  let user_arr = [];
  fs.readFile('data.json', 'utf-8', function(err, data) {
    console.log(err);
    if (!err) {
      if (data) user_arr = JSON.parse(data);
      res.status(200).send(user_arr.map((item) => {
        return {
          name: item.name || '名字',
          department: item.department || '部门',
          position: item.position || '职位',
        }
      }));
    } else {
      res.status(403).send([{
        message: '错误'
      }])
    }
  })
})

app.get('/queryInfo', function (req, res) {
  let user_arr = [];
  fs.readFile('data.json', function(err, data) {
    if (data) user_arr = JSON.parse(data);
    let showData = [];
    function filter_class(str) {
      return user_arr.filter((item) => {
        return req.query.query.replace(/\s/g,'') === item[str]
      })
      .map((item) => {
        return {
          name: item.name,
          department: item.department,
          position: item.position || '职位',
        }
      })
    }
    if (filter_class('name').length) {
      res.status(200).send(filter_class('name'));
    } else if (filter_class('department').length) {
      res.status(200).send(filter_class('department'));
    } else if (filter_class('position').length){
      res.status(200).send(filter_class('position'));
    } else {
      res.status(403).send('无法识别所输入的数据')
    }
  });
})

app.get('/queryInfoAdmin', function (req, res) {
  let user_arr = [];
  fs.readFile('data.json', function(err, data) {
    if (!err) {
      if (data) {
        user_arr = JSON.parse(data);
      }
      if (!req.query.query) {
        res.status(200).send(
          user_arr.length !== 0 ? 
          user_arr.map((item) => {
            return {
              name: item.name,
              department: item.department,
              birthday: item.birthday || '未输入',
              tel: item.tel || '未输入',
              QQ: item.QQ || '未输入',
              email: item.email || '未输入',
              number: item.number || '未输入',
              school: item.school || '未输入',
              position: item.position || '未输入',
            }
          }) 
          : 
          [{
            message: '暂时没有数据'
          }]
        )
        return ;
      }
      function filter_class(str) {
        return user_arr.filter((item) => {
          return req.query.query.replace(/\s/g,'') === item[str]
        })
        .map((item) => {
          return {
            name: item.name,
            department: item.department,
            birthday: item.birthday || '未输入',
            tel: item.tel || '未输入',
            QQ: item.QQ || '未输入',
            email: item.email || '未输入',
            number: item.number || '未输入',
            school: item.school || '未输入',
            position: item.position || '未输入',
          }
        })
      }
      if (filter_class('name').length) {
        res.status(200).send(filter_class('name'));
        return ;
      } else if (filter_class('department').length) {
        res.status(200).send(filter_class('department'));
        return;
      } else {
        res.status(403).send('无法识别所输入的数据')
        return ;
      }
    }
  });
})

// 获取他人信息(管理员)
app.get('/queryAdmin', function (req, res) {
  fs.readFile('data.json', function (err, data) {
    if (!err) {
      if (data) {
        if (JSON.parse(data).findIndex((item) => {
              return item.number === req.query.queryNumber
            }) !== -1) {
          res.status(200).send(JSON.parse(data).filter((item) => {
            return item.number === req.query.queryNumber
          }))
        } else {
          res.status(403).send({
            message: '查不到'
          })
        }
      } else {
        console.log('File not found')
      }
    }
  })
})

// 删除

app.use('/delete', function (req, res) {
  let data_arr = [];
  let password_arr = [];
  fs.readFile('data.json', function (err, data) {
    if (!err) {
      if (data) data_arr = JSON.parse(data);
      fs.readFile('password.txt', function (err, data) {
        if (!err) {
          if (data) password_arr = JSON.parse(data);
          let j = null;
          let number = req.query.number;
          for (let i = 0; i < number.length; i++) {
            data_arr.map((item, index) => {
              if (item.number === number[i]) {
                j = index;
              }
            })
            if (j !== null) {
              data_arr.splice(j,1);
              password_arr.splice(j,1);
            }
          }
          fs.writeFile('data.json', JSON.stringify(data_arr), function (err) {
            if (err) {
              console.log(err);
            }
          })
          if (j !== null) {
            res.status(200).send([{
              message: '删除成功'
            }])
          } else {
            res.status(403).send([{
              message: '删除失败'
            }])
          }
        }
      })
    } else {
      console.log('file not found');
    }
  })
})

app.get('/updatePeople', function (req, res) {
  let data_arr = [];
  fs.readFile('data.json', function (err,data) {
    let boolean = false;
    if (!err) {
      if (data) {
        data_arr = JSON.parse(data).map((item) => {
          if (item.number === req.query.number) {
            boolean = true;
            return {
              name: req.query.name || item.name,
              school: req.query.school || item.school,
              department : req.query.department || item.department,
              position: req.query.position || item.position,
              birthday: req.query.birthday || item.birthday,
              tel: req.query.tel || item.tel,
              QQ: req.query.QQ || item.QQ,
              email: req.query.email || item.email,
              number: req.query.number || item.number,
              message: req.query.message || item.message
            }
          } else {
            return item;
          }
        })
        fs.writeFile('data.json', JSON.stringify(data_arr), function (err) {
          if (err) {
            console.log(err);
          } else {
            if (boolean) {
              res.status(200).send([{
                message: '修改成功'
              }])
            } else {
              res.status(403).send([{
                message: '修改失败'
              }])
            }
          }
        })
      }
    }
  })
})

app.get('/query', function (req, res) {
  fs.readFile('data.json', function (err, data) {
    let data_arr = [];
    if (!err) {
      if (data) data_arr = JSON.parse(data);

      data_arr.filter((item) => {
        return item.name === req.query.queryName
      }).length !== 0
      ?
      res.status(200).send(data_arr.filter((item) => {
        return item.name === req.query.queryName
      }))
      :
      res.status(403).send([{
        message: "无权限"
      }])
    }
  })
})

app.get('/queryNumber', function (req, res) {
  fs.readFile('data.json', function (err, data) {
    let data_arr = [];
    if (!err) {
      if (data) data_arr = JSON.parse(data);
      let filter_arr = data_arr.filter((item) => {
        return item.number === req.query.queryNumber
      })
      if (filter_arr.length) {
        res.status(200).send(filter_arr)
      } else {
        res.status(403).send([{
          message: "无权限"
        }])
      }
    }
  })
})

// 没课表查询
app.get('/free', function (req, res) {
  let spare_arr = [];
  fs.readFile('spare.txt', function (err, data) {
    if(!err) {
      spare_arr = JSON.parse(data);
      let name_arr = [];
      spare_arr.map((item) => {
        var num = (+req.query.class.split('-')[0] + 1) / 2;
        if (+item.day[req.query.weekNum][+req.query.day - 1][num] === 1 && item.department === req.query.department) {
          name_arr.push(item.name);
        }
      })
      res.status(200).send({
        name: name_arr,
        message: '请求成功'
      });
    }
  })
})
// 没课表录入
app.get('/insertFree', function (req, res) {
  let day = req.query.day;
  let week_num = req.query.week_num;
  let spare_arr = [];
  fs.readFile('spare.txt', function (err, data) {
    if (!err) {
      spare_arr = data !== '' && data? JSON.parse(data.toString()) : [];
      fs.readFile('data.json', function (err, data) {
        let data_arr = [];
        if (!err) {
          if (data) data_arr = JSON.parse(data);
        }
        let has_number = -1;
        spare_arr.map((item, index) => {
          if (item.number === grobal.person.number) {
            has_number = index;
          }
        })
        console.log(has_number);
        if (has_number !== -1) {
          for (var j = 0; j < week_num.length; j++) {
            spare_arr[has_number].day[week_num[j]] = day;
          }
        } else {
          let spare_item = {
            name: '',
            number: '',
            department: '',
            day: {
              
            }
          };
          data_arr.map((item) => {
            if (item.number === grobal.person.number) {
              spare_item.name = item.name;
              spare_item.department = item.department;
            }
          })
          for (var j = 0; j < week_num.length; j++) {
            spare_item.day[week_num[j]] = day;
          }
          spare_item.number = grobal.person.number || '';
          spare_arr.push(spare_item);
        }
        // (spare_arr);
        fs.writeFile('spare.txt', JSON.stringify(spare_arr), function (err) {
          if (err) console.log(err);
        })
        res.status(200).send([{
          message: '录入成功'
        }])
      })
    }
  })
})


app.listen(3000, () => {
  console.log('port on 3000');
})