from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user

class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission for product operations.
    Only sellers can create products, and only product owners can edit.
    """
    
    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for authenticated users
        if not request.user.is_authenticated:
            return False
        
        # Only farmers can create products
        if view.action == 'create':
            return request.user.role == 'farmer'
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the seller of the product
        return obj.seller == request.user

class IsMessageParticipant(permissions.BasePermission):
    """
    Custom permission for message operations.
    Only sender or receiver can view/edit messages.
    """
    
    def has_object_permission(self, request, view, obj):
        return request.user == obj.sender or request.user == obj.receiver

class IsReviewOwner(permissions.BasePermission):
    """
    Custom permission for review operations.
    Only review author can edit their review.
    """
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.reviewer == request.user
