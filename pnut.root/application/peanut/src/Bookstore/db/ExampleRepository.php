<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 5/6/2017
 * Time: 9:08 AM
 */

namespace Bookstore\db;
use \PDO;

class ExampleRepository
{
    public static function Get($id) {
        $dbh = Database::getConnection();
        $sql = "SELECT * FROM examples WHERE id = ?";
        /**
         * @var PDOStatement
         */
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array($id));
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'Bookstore\db\model\Example');
        $result = $stmt->fetch();
        return $result;
    }

    public static function Update($dto, $userName = 'admin') {

        $dbh = Database::getConnection();
        $sql =
            "UPDATE examples SET /n".
            "name       = :name, /n".
            "isbn       = :isbn,/n".
            "authors    = :authors,/n".
            "price      = :price,/n".
            "changedby  = :changedby,/n".
            "changedon  = :changedon /n".
            "WHERE id = :id";

        // print $sql;
        // exit;
        $today = new \DateTime();
        $date = $today->format('Y-m-d H:i:s');

        /**
         * @var PDOStatement
         */
        $stmt = $dbh->prepare($sql);
        // $stmt->bindValue(:id,        $dto->id        );
        $stmt->bindParam(':name',      $dto->name   ,PDO::PARAM_STR );
        $stmt->bindParam(':isbn',      $dto->isbn   ,PDO::PARAM_STR );
        $stmt->bindParam(':authors',   $dto->authors,PDO::PARAM_STR );
        $stmt->bindParam(':createdby', $userName 	,PDO::PARAM_STR	);
        $stmt->bindParam(':createdon', $date		,PDO::PARAM_STR	);
        $stmt->bindParam(':changedby', $userName 	,PDO::PARAM_STR	);
        $stmt->bindParam(':changedon', $date		,PDO::PARAM_STR	);

        // $dbh->beginTransaction();
        $count = $stmt->execute();
        $result = $dbh->lastInsertId();
        // $dbh->commit();
        return $result;
    }

    public static function Create($dto,$userName = 'admin') {
        $dbh = Database::getConnection();
        $sql = "INSERT INTO examples (name, isbn, authors, price, createdby, createdon, changedby, changedon) ".
                "VALUES (:name, :isbn, :authors, :price, :createdby, :createdon, :changedby, :changedon)";

        $today = new \DateTime();
        $date = $today->format('Y-m-d H:i:s');

        /**
         * @var PDOStatement
         */
        $stmt = $dbh->prepare($sql);
        $stmt->bindValue(':name',      $dto->name   ,PDO::PARAM_STR );
        $stmt->bindValue(':isbn',      $dto->isbn   ,PDO::PARAM_STR );
        $stmt->bindValue(':authors',   $dto->authors,PDO::PARAM_STR );
        $stmt->bindValue(':price' ,    $dto->price,  PDO::PARAM_STR );
        $stmt->bindValue(':createdby', $userName 	,PDO::PARAM_STR	);
        $stmt->bindValue(':createdon', $date		,PDO::PARAM_STR	);
        $stmt->bindValue(':changedby', $userName 	,PDO::PARAM_STR	);
        $stmt->bindValue(':changedon', $date		,PDO::PARAM_STR	);

        // $dbh->beginTransaction();
        $count = $stmt->execute();
        $result = $dbh->lastInsertId();
        // $dbh->commit();
        return $result;
    }

    public static function Delete($id) {
        $dbh = Database::getConnection();
        $sql = "DELETE FROM examples WHERE id = ?";
        /**
         * @var PDOStatement
         */
        $stmt = $dbh->prepare($sql);
        $stmt->execute(array($id));
    }

    public static function GetAll($where = '' ) {
        $dbh = Database::getConnection();
        $sql = "SELECT * FROM examples";
        if ($where) {
            $sql .= " WHERE $where";
        }

        /**
         * @var PDOStatement
         */
        $stmt = $dbh->prepare($sql);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_CLASS,'Bookstore\db\model\Example');
        return $result;
    }
}