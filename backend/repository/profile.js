const db = require('./config'),
  userCollection = db.collection('User');

exports.saveComment = async (userId, comment, exists) => {
  // Ha még nem léteznek véleményezések a felhasználónál, inicializáljuk a beágyazást:
  // létrehozunk egy objektumot a "comments" kulccsal, ez tartalmazni fog egy objektumokból álló
  // listát.Ezek az objektumok rendre tartalmazzák a dátumot, id-t, véleményt, amiket a felhasználók
  // hozzáfűztek egy edzőhöz. Különben hozzá APPEND-eljük a meglévő véleményekhez az újat.
  if (!exists) {
    const newComment = { comments: [{ ...comment }] };
    return userCollection.update(userId, newComment);
  }
  return db.query(
    'LET user = DOCUMENT(@userId) UPDATE user WITH { comments: APPEND(user.comments, @comment)} in User',
    { userId, comment },
  );
};

// Végigmegyünk annak a felhasználónak a véleményein, amelynek profiljáról szeretnénk kitörölni a
// saját véleményünket. Felépítünk egy új record-ot azokkal a kommentekkel, amelyek nem tartalmazzák
// a törölni kívántat. A mi username-ünk kell legyen a from, mert más kommentjét nem törölhetjük.
exports.deleteComment = async (userId, commentId, userName) => db.query(
  'LET user = DOCUMENT(@userId)\n LET newComments = (\n'
  + 'FOR comment IN user.comments '
  + 'FILTER (comment.commentId != @commentId) || (comment.commentId == @commentId && comment.from.userName != @userName) \n'
  +  'RETURN comment ) \n'
  + 'UPDATE user WITH { comments: newComments } IN User',
  { userId, commentId, userName },
);
