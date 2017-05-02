const DROP_YES = "data:image/png;base64,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AAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDktMTdUMTU6MjE6NTcrMDg6MDDT6TM7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTE1VDIyOjQ1OjU0KzA4OjAwduz2GAAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MzBTtVAvAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADY2OLGuwlwAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ0NDkyMDM1NHlv8aEAAAASdEVYdFRodW1iOjpTaXplADE4LjRLQodXsbUAAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExOTUxLzExOTUxOTAucG5ngJRx5QAAAABJRU5ErkJggg==";

export default DROP_YES;