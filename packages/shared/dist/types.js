export var UserRole;
(function (UserRole) {
    UserRole["GUEST"] = "GUEST";
    UserRole["MASTER"] = "MASTER";
    UserRole["PLAYER"] = "PLAYER";
    UserRole["VENUE"] = "VENUE";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
export var SessionStatus;
(function (SessionStatus) {
    SessionStatus["DRAFT"] = "draft";
    SessionStatus["PUBLISHED"] = "published";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["CANCELED"] = "canceled";
})(SessionStatus || (SessionStatus = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["RECEIVED"] = "RECEIVED";
    PaymentStatus["CONFIRMED"] = "CONFIRMED";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (PaymentStatus = {}));
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING_SIGNATURE"] = "pending_signature";
    ContractStatus["SIGNED"] = "signed";
    ContractStatus["CANCELED"] = "canceled";
})(ContractStatus || (ContractStatus = {}));
export var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    BookingStatus["PAID"] = "PAID";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELED"] = "CANCELED";
    BookingStatus["REFUNDED"] = "REFUNDED";
})(BookingStatus || (BookingStatus = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY"] = "READY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELED"] = "CANCELED";
})(OrderStatus || (OrderStatus = {}));
