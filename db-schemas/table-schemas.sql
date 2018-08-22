CREATE TABLE IF NOT EXISTS Clients (
    ClientID CHAR(14) NOT NULL,
    FirstName CHAR(255) NOT NULL,
    MiddleName CHAR(255),
    LastName CHAR(255),
    Country CHAR(255) NOT NULL DEFAULT "UGANDA",
    AddressLineOne VARCHAR(255),
    AddressLineTwo VARCHAR(255),
    CountryCode VARCHAR(4),
    PhoneNumber VARCHAR(25),
    Email VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255),
    PRIMARY KEY (ClientID)
);

CREATE TABLE IF NOT EXISTS Providers (
    ShopID CHAR(14) NOT NULL,
    ProviderName VARCHAR(255),
    AddressLineOne VARCHAR(255),
    AddressLineTwo VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    PRIMARY KEY (ShopID)
);

CREATE TABLE IF NOT EXISTS Items (
    ItemID CHAR(14) NOT NULL,
    ItemName CHAR(255) NOT NULL,
    StoreID CHAR(255) NOT NULL,
    MakerName CHAR(255),
    Price FLOAT(10,2) DEFAULT 0,
    Descriptn VARCHAR(512),
    MakeDate DATETIME,
    CategoryID CHAR(14) NOT NULL,
    SubCategoryID CHAR(14) NOT NULL,
    Available BOOL NOT NULL,
    StockDate DATETIME,
    PRIMARY KEY (ItemID)
);

CREATE TABLE IF NOT EXISTS Categories (
    CategoryID CHAR(14) NOT NULL,
    ItemID CHAR(14) NOT NULL,
    CategoryName VARCHAR(255) NOT NULL,
    NumberOfItems MEDIUMINT NOT NULL DEFAULT 1,
    DateAdded DATETIME NOT NULL,
    Descriptn TEXT,
    PRIMARY KEY (CategoryID)
);

CREATE TABLE IF NOT EXISTS Subcategories (
    SubcategoryID CHAR(14) NOT NULL,
    SubcategoryName CHAR(64) NOT NULL,
    SubcatDescription VARCHAR(512),
    PRIMARY KEY (SubcategoryID)
);

CREATE TABLE IF NOT EXISTS CatMap (
    CategoryID CHAR(14) NOT NULL,
    SubcategoryID CHAR(14) NOT NULL,
    PRIMARY KEY (CategoryID, SubCategoryID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (SubcategoryID) REFERENCES Subcategories(SubcategoryID)
);

CREATE TABLE IF NOT EXISTS SubcategoryImages (
    ImageID CHAR(14) NOT NULL,
    SubcategoryID CHAR(14) NOT NULL,
    ImageURI VARCHAR(14) NOT NULL,
    TimeStmp TIMESTAMP NOT NULL,
    Dimensions VARCHAR(255),
    PRIMARY KEY (ImageID),
    FOREIGN KEY (SubcategoryID) REFERENCES Subcategories(SubcategoryID)
);

CREATE TABLE IF NOT EXISTS ActualPhotos (
    PhotoID CHAR(14) NOT NULL,
    ItemID CHAR(14) NOT NULL,
    PhotoURI VARCHAR(255) NOT NULL,
    TimeStmp TIMESTAMP,
    PRIMARY KEY (PhotoID),
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID)
);

CREATE TABLE IF NOT EXISTS ProviderItems (
    ProvItemID CHAR(14) NOT NULL,
    ItemName VARCHAR(255) NOT NULL,
    StoreID CHAR(255) NOT NULL,
    MakerName CHAR(255),
    Price FLOAT(10,2) NOT NULL DEFAULT 0,
    Descriptn VARCHAR(512),
    MakeDate DATETIME,
    CategoryID VARCHAR(14) NOT NULL,
    SubcategoryID VARCHAR(14) NOT NULL,
    Available BOOL,
    StockDate DATETIME NOT NULL,
    Publicised BOOL, /*Whether or not the item has been approved*/
    PRIMARY KEY (ProvItemID),
    FOREIGN KEY (SubcategoryID) REFERENCES Subcategories(SubcategoryID)
);

CREATE TABLE IF NOT EXISTS Orders (
    OrderID CHAR(14) NOT NULL,
    ClientID CHAR(14) NOT NULL,
    ItemID VARCHAR(14) NOT NULL,
    Quantity SMALLINT DEFAULT 1,
    Paid BOOL,
    OrderStatus ENUM("PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"),
    PRIMARY KEY (OrderID),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
); 

ALTER TABLE Items ADD FULLTEXT(ItemName, MakerName, Descriptn);