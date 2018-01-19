const Mark = require('../../../db/Mark')
const User = require('../../../db/User')
module.exports = socket => {
  socket.on('join_mark_group', data => {
    Mark.find({markName: data.markName, _id: data.id}, (err, docs) => {
      if (err || docs.length > 1) {
        return socket.emit('join_mark_group_error', {markName: data.markName, message: '查询出现错误'})
      } else {
        if (docs.length === 0) {
          return socket.emit('join_mark_group_error', {markName: data.markName, message: '没有该评分工作组'})
        } else {
          if (docs[0].password === data.password && data.username === socket.client.username) {
            // 将该表的信息加入用户数据库中
            User.update({username: data.username, 'marks.id': data.data.id}, {$set: {'marks.$': data.data}}, {}, (err, updateData) => {
              if (err) {
                return socket.emit('join_mark_group_error', {markName: data.markName, message: '加入出现错误'})
              } else {
                if (updateData.n === 0 && updateData.nModified === 0) {
                  User.update({username: data.username}, {$push: {marks: data.data}}, {}, err => {
                    if (err) {
                      return socket.emit('join_mark_group_error', {markName: data.markName, message: '加入出现错误'})
                    } else {
                      socket.join(data.id, () => {
                        socket.client.rooms.add(data.id)
                        if (docs[0].auth) {
                          socket.client.realNameRooms.add(data.id)
                        } else {
                          socket.client.notRealNameRooms.add(data.id)
                        }
                        socket.to(data.id).emit('broadcast_join_mark_group_success', {message: `${socket.client.username}进入了${data.markName}评分工作组`})
                        return socket.emit('join_mark_group_success', {markName: data.markName, data: docs[0]})
                      })
                    }
                  })
                } else {
                  socket.join(data.id, () => {
                    socket.client.rooms.add(data.id)
                    if (docs[0].auth) {
                      socket.client.realNameRooms.add(data.id)
                    } else {
                      socket.client.notRealNameRooms.add(data.id)
                    }
                    socket.to(data.id).emit('broadcast_join_mark_group_success', {message: `${socket.client.username}进入了${data.markName}评分工作组`})
                    return socket.emit('join_mark_group_success', {markName: data.markName, data: docs[0]})
                  })
                }
              }
            })
          } else {
            return socket.emit('join_mark_group_error', {markName: data.markName, message: '密码错误或没有权限'})
          }
        }
      }
    })
  })
}
