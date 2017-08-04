<?php 
/** 
 * Created by /tools/create-model.php 
 * Time:  2017-05-25 10:53:53
 */ 

namespace Bookstore\db; 
use \PDO; 
class OrderstatuseRepository 
{
    public static function Get($id) { 
        $dbh = Database::getConnection();
        $sql = "SELECT * FROM orderstatuses WHERE id = ?";
        /** 
         * @var PDOStatement 
         */ 
        $stmt = $dbh->prepare($sql); 
        $stmt->execute(array($id)); 
        $stmt->setFetchMode(PDO::FETCH_CLASS, 'Bookstore\db\model\Orderstatuse'); 
        $result = $stmt->fetch(); 
        return $result; 
    } 
 
    public static function Update($dto, $userName = 'admin') { 
        $dbh = Database::getConnection(); 
        $sql = 
            "UPDATE orderstatuses SET ".
            "id = :id, \n".
"status = :status".
 
        "WHERE id = :id"; 
        $today = new \DateTime();  
        $date = $today->format('Y-m-d H:i:s');  

        /** 
         * @var PDOStatement 
         */ 
        $stmt = $dbh->prepare($sql);  
        
$stmt->bindValue(':id', $dto->id, PDO::PARAM_INT);
$stmt->bindValue(':status', $dto->status, PDO::PARAM_STR); 
        $count = $stmt->execute(); 
        $result = $dbh->lastInsertId(); 
        return $result;  
    } 
 
    public static function Create($dto,$userName = 'admin') { 
        $dbh = Database::getConnection(); 
        $sql = "INSERT INTO orderstatuses (  id, status) ". 
                "VALUES ( :id, :status)"; 

        $today = new \DateTime(); 
        $date = $today->format('Y-m-d H:i:s'); 

        /** 
         * @var PDOStatement 
         */ 
        $stmt = $dbh->prepare($sql); 
        
$stmt->bindValue(':id', $dto->id, PDO::PARAM_INT);
$stmt->bindValue(':status', $dto->status, PDO::PARAM_STR);  

          

        $count = $stmt->execute(); 
        $result = $dbh->lastInsertId(); 
        return $result; 
    } 

    public static function Delete($id) { 
        $dbh = Database::getConnection(); 
        $sql = "DELETE FROM orderstatuses WHERE id = ?"; 
        /** 
         * @var PDOStatement 
         */ 
        $stmt = $dbh->prepare($sql); 
        $stmt->execute(array($id)); 
    } 

    public static function GetAll($where = '' ) { 
        $dbh = Database::getConnection(); 
        $sql = "SELECT * FROM orderstatuses"; 
        if ($where) { 
            $sql .= " WHERE $where"; 
        } 

        /** 
         * @var PDOStatement 
         */ 
        $stmt = $dbh->prepare($sql); 
        $stmt->execute(); 

        $result = $stmt->fetchAll(PDO::FETCH_CLASS,'Bookstore\db\model\Orderstatuse'); 
        return $result; 
    } 
} 
