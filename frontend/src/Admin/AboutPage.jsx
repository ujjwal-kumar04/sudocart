import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Rating,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMyOrders, getUserInfo, submitProductReview } from '../service/api';

const AboutPage = ({ username }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewLoading, setReviewLoading] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = username ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.username ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.email ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.mobile;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setReviewLoading(true);
        const [userRes, ordersRes] = await Promise.all([
          getUserInfo(),
          getMyOrders()
        ]);

        setUser(userRes.data);

        const flattenedDeliveredItems = ordersRes.data.flatMap((order) =>
          (order.cartItems || [])
            .map((item, itemIndex) => ({
              ...item,
              orderId: order._id,
              itemIndex,
              orderDate: order.createdAt
            }))
            .filter((item) => item.status === 'Delivered')
        );

        flattenedDeliveredItems.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setDeliveredItems(flattenedDeliveredItems);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please login again.");
          setTimeout(() => {
            localStorage.removeItem("loggedInUser");
            navigate("/login");
          }, 2000);
        } else {
          setError("Failed to load user info");
        }
        console.error(err);
      } finally {
        setReviewLoading(false);
      }
    };
    if (loggedInUser) fetchUserInfo();
  }, [loggedInUser, navigate]);

  const getItemKey = (item) => `${item.orderId}-${item.itemIndex}`;

  const handleDraftChange = (itemKey, nextValue) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [itemKey]: {
        rating: 0,
        comment: '',
        ...prev[itemKey],
        ...nextValue
      }
    }));
  };

  const handleSubmitReview = async (item) => {
    const itemKey = getItemKey(item);
    const draft = reviewDrafts[itemKey] || { rating: 0, comment: '' };

    if (!draft.rating || draft.rating < 1) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Please select a rating',
        showConfirmButton: false,
        timer: 1800
      });
      return;
    }

    const productId = typeof item.productId === 'object' ? item.productId?._id : item.productId;

    if (!productId) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: 'Product not found for review',
        showConfirmButton: false,
        timer: 1800
      });
      return;
    }

    try {
      await submitProductReview(productId, {
        orderId: item.orderId,
        itemIndex: item.itemIndex,
        rating: draft.rating,
        comment: draft.comment
      });

      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Review submitted successfully',
        showConfirmButton: false,
        timer: 1800
      });

      setDeliveredItems((prev) => prev.map((lineItem) =>
        getItemKey(lineItem) === itemKey
          ? { ...lineItem, reviewed: true, reviewedAt: new Date().toISOString() }
          : lineItem
      ));
    } catch (submitError) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: submitError.response?.data?.message || 'Failed to submit review',
        showConfirmButton: false,
        timer: 2200
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {!user && !error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
      {user && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#000', borderBottom: '3px solid #ffe680', pb: 1 }}>
            {user.role === 'seller' ? '🏪 ' : '👤 '}Welcome, {user.name}
          </Typography>

          {/* Personal Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
              📋 Personal Information
            </Typography>
            <Typography variant="body1" gutterBottom><strong>Name:</strong> {user.name}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Mobile:</strong> {user.mobile}</Typography>
            <Typography variant="body1" gutterBottom><strong>Role:</strong> {user.role === 'seller' ? 'Seller' : 'Customer'}</Typography>
            {user.gender && <Typography variant="body1" gutterBottom><strong>Gender:</strong> {user.gender}</Typography>}
            {user.dob && <Typography variant="body1" gutterBottom><strong>Date of Birth:</strong> {user.dob}</Typography>}
          </Box>

          {/* Seller-specific Information */}
          {user.role === 'seller' && (
            <>
              {/* Business Information */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                  🏢 Business Information
                </Typography>
                {user.shopName && <Typography variant="body1" gutterBottom><strong>Shop/Brand Name:</strong> {user.shopName}</Typography>}
                {user.businessCategory && <Typography variant="body1" gutterBottom><strong>Business Category:</strong> {user.businessCategory}</Typography>}
                {user.businessDescription && <Typography variant="body1" gutterBottom><strong>Description:</strong> {user.businessDescription}</Typography>}
              </Box>

              {/* Legal Documents */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                  📄 Legal Documents
                </Typography>
                {user.panCard && <Typography variant="body1" gutterBottom><strong>PAN Card:</strong> {user.panCard}</Typography>}
                {user.aadhaar && <Typography variant="body1" gutterBottom><strong>Aadhaar:</strong> {user.aadhaar}</Typography>}
                {user.gstNumber && <Typography variant="body1" gutterBottom><strong>GST Number:</strong> {user.gstNumber}</Typography>}
              </Box>
            </>
          )}

          {/* Address Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
              📍 {user.role === 'seller' ? 'Business' : ''} Address
            </Typography>
            {user.addressLine && <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.addressLine}</Typography>}
            {user.city && <Typography variant="body1" gutterBottom><strong>City:</strong> {user.city}</Typography>}
            {user.state && <Typography variant="body1" gutterBottom><strong>State:</strong> {user.state}</Typography>}
            {user.pincode && <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.pincode}</Typography>}
          </Box>

          {/* Pickup Address - Seller only */}
          {user.role === 'seller' && user.pickupAddressLine && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                📦 Pickup Address
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.pickupAddressLine}</Typography>
              <Typography variant="body1" gutterBottom><strong>City:</strong> {user.pickupCity}</Typography>
              <Typography variant="body1" gutterBottom><strong>State:</strong> {user.pickupState}</Typography>
              <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.pickupPincode}</Typography>
              {user.pickupContactNumber && <Typography variant="body1" gutterBottom><strong>Contact:</strong> {user.pickupContactNumber}</Typography>}
            </Box>
          )}

          {/* Return Address - Seller only */}
          {user.role === 'seller' && user.returnAddressLine && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                🔄 Return Address
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.returnAddressLine}</Typography>
              <Typography variant="body1" gutterBottom><strong>City:</strong> {user.returnCity}</Typography>
              <Typography variant="body1" gutterBottom><strong>State:</strong> {user.returnState}</Typography>
              <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.returnPincode}</Typography>
            </Box>
          )}

          {/* Bank Details - Seller only */}
          {user.role === 'seller' && user.accountNumber && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                🏦 Bank Details
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Account Holder:</strong> {user.accountHolderName}</Typography>
              <Typography variant="body1" gutterBottom><strong>Account Number:</strong> {user.accountNumber}</Typography>
              <Typography variant="body1" gutterBottom><strong>IFSC Code:</strong> {user.ifscCode}</Typography>
              <Typography variant="body1" gutterBottom><strong>Bank Name:</strong> {user.bankName}</Typography>
            </Box>
          )}

          {user.role !== 'seller' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                ⭐ Delivered Orders - Review & Rating
              </Typography>

              {reviewLoading ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress size={24} />
                </Box>
              ) : deliveredItems.length === 0 ? (
                <Alert severity="info">No delivered products found yet. You can review products after delivery.</Alert>
              ) : (
                <Stack spacing={2}>
                  {deliveredItems.map((item) => {
                    const itemKey = getItemKey(item);
                    const draft = reviewDrafts[itemKey] || { rating: 0, comment: '' };

                    return (
                      <Card key={itemKey} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                            <Typography variant="subtitle1" fontWeight={700}>{item.name}</Typography>
                            <Chip
                              size="small"
                              label={item.reviewed ? 'Reviewed' : 'Delivered'}
                              color={item.reviewed ? 'success' : 'primary'}
                              variant={item.reviewed ? 'filled' : 'outlined'}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Qty: {item.quantity} • Price: ₹{item.price} • Delivered on {new Date(item.orderDate).toLocaleDateString('en-IN')}
                          </Typography>

                          {!item.reviewed ? (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                Rate your experience
                              </Typography>
                              <Rating
                                value={Number(draft.rating) || 0}
                                precision={1}
                                onChange={(_, nextValue) => {
                                  handleDraftChange(itemKey, { rating: nextValue || 0 });
                                }}
                              />
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Write a helpful review (optional)"
                                value={draft.comment || ''}
                                onChange={(event) => handleDraftChange(itemKey, { comment: event.target.value })}
                                sx={{ mt: 1.5 }}
                              />
                              <Button
                                variant="contained"
                                sx={{ mt: 1.5, backgroundColor: '#000', '&:hover': { backgroundColor: '#222' } }}
                                onClick={() => handleSubmitReview(item)}
                              >
                                Submit Review
                              </Button>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ mt: 1.5, color: 'success.main', fontWeight: 600 }}>
                              Thank you. Your review has been recorded.
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )}

          {/* Logout Button */}
          <Box mt={3} textAlign="center">
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AboutPage;
