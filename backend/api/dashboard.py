from fastapi import APIRouter, Depends, HTTPException
from database.mongo import get_collection
from api.dependencies import get_current_admin
from schemas.user import AdminResponse
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi.responses import FileResponse
from reportlab.lib.styles import getSampleStyleSheet
import tempfile
from datetime import datetime
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak
)

router = APIRouter()

@router.get("/analytics")
async def get_analytics():
    customers_col = get_collection("customers")
    visits_col = get_collection("visit_logs")
    reviews_col = get_collection("reviews")
    chat_col = get_collection("chat_logs")

    total_customers = await customers_col.count_documents({})
    returning_customers = await customers_col.count_documents({"visit_count": {"$gt": 1}})
    new_customers = total_customers - returning_customers

    pos = await reviews_col.count_documents({"sentiment": "Positive"})
    neg = await reviews_col.count_documents({"sentiment": "Negative"})
    neu = await reviews_col.count_documents({"sentiment": "Neutral"})

    total_chats = await chat_col.count_documents({})
    products_col = get_collection("product_logs")

    total_reviews = await reviews_col.count_documents({})
    products_classified = await products_col.count_documents({})
    today = datetime.now()
    start_of_day = datetime(today.year, today.month, today.day)

    daily_visits = await visits_col.count_documents({
        "timestamp": {
            "$gte": start_of_day
        }
    })

    recent_visits = await visits_col.find().sort("timestamp", -1).limit(5).to_list(5)
    activities = []
    for v in recent_visits:
        cust = await customers_col.find_one({"_id": v["customer_id"]})
        name = cust["name"] if cust else "Unknown"
        activities.append({
            "action": f"{name} visited the store",
            "time": v["timestamp"].isoformat(),
            "type": v["type"]
        })

    last7 = []
    labels = []

    for i in range(6, -1, -1):
        day = datetime.now() - timedelta(days=i)
        start = datetime(day.year, day.month, day.day)
        end = start + timedelta(days=1)

        count = await visits_col.count_documents({
            "timestamp": {
                "$gte": start,
                "$lt": end
            }
        })

        labels.append(day.strftime("%a"))
        last7.append(count)

    return {
        "summary": {
            "total_customers": total_customers,
            "returning_customers": returning_customers,
            "new_customers": new_customers,
            "chatbot_usage": total_chats,
            "total_reviews": total_reviews,
            "daily_visits": daily_visits,
            "products_classified": products_classified
        },
        "sentiment_distribution": {
            "positive": pos,
            "negative": neg,
            "neutral": neu
        },
        "footfall": {
            "labels": labels,
            "data": last7
        },
        "recent_activities": activities
    }

@router.get("/customers")
async def get_customers_list():
    customers_col = get_collection("customers")
    customers = await customers_col.find().sort("last_visit", -1).to_list(100)
    
    result = []
    for c in customers:
        c["id"] = str(c.pop("_id"))
        if "face_encoding" in c:
            del c["face_encoding"]
        result.append(c)
        
    return result

@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str, current_user: AdminResponse = Depends(get_current_admin)):
    customers_col = get_collection("customers")
    result = await customers_col.delete_one({"_id": ObjectId(customer_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

@router.get("/reviews")
async def get_reviews_list():
    reviews_col = get_collection("reviews")
    reviews = await reviews_col.find().sort("timestamp", -1).to_list(100)
    
    result = []
    for r in reviews:
        r["id"] = str(r.pop("_id"))
        result.append(r)
        
    return result

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.linecharts import HorizontalLineChart


@router.get("/download-report")
async def download_report():

    customers_col = get_collection("customers")
    visits_col = get_collection("visit_logs")
    reviews_col = get_collection("reviews")
    chat_col = get_collection("chat_logs")
    products_col = get_collection("product_logs")

    total_customers = await customers_col.count_documents({})
    returning = await customers_col.count_documents({"visit_count": {"$gt": 1}})
    today = datetime.now()

    start_of_day = datetime(
        today.year,
        today.month,
        today.day
    )

    visits = await visits_col.count_documents({
        "timestamp": {
            "$gte": start_of_day
        }
    })
    reviews = await reviews_col.count_documents({})
    products = await products_col.count_documents({})
    chats = await chat_col.count_documents({})

    positive = await reviews_col.count_documents({"sentiment": "Positive"})
    negative = await reviews_col.count_documents({"sentiment": "Negative"})
    neutral = await reviews_col.count_documents({"sentiment": "Neutral"})

    from datetime import timedelta


    labels = []
    footfall = []

    for i in range(6, -1, -1):
        day = datetime.now() - timedelta(days=i)

        start = datetime(day.year, day.month, day.day)
        end = start + timedelta(days=1)

        count = await visits_col.count_documents({
            "timestamp": {
                "$gte": start,
                "$lt": end
            }
        })

        labels.append(day.strftime("%a"))
        footfall.append(count)

    pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name

    doc = SimpleDocTemplate(
        pdf,
        topMargin=30,
        bottomMargin=30,
        leftMargin=40,
        rightMargin=40
    )

    styles = getSampleStyleSheet()

    title = styles["Title"]
    title.alignment = TA_CENTER
    title.textColor = colors.HexColor("#1E88E5")

    heading = styles["Heading2"]
    heading.textColor = colors.HexColor("#1565C0")

    story = []

    story.append(Paragraph("<b>SmartRetail AI</b>", title))
    story.append(Paragraph("Retail Analytics Dashboard Report", heading))
    story.append(Spacer(1, 15))

    story.append(
        Paragraph(
            "<b>Generated:</b> {}".format(
                datetime.now().strftime("%d %B %Y %I:%M %p")
            ),
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 20))

    data = [
        ["Metric", "Value"],
        ["Total Customers", total_customers],
        ["Returning Customers", returning],
        ["Daily Visits", visits],
        ["Products Classified", products],
        ["Chatbot Queries", chats],
        ["Total Reviews", reviews],
        ["Positive Reviews", positive],
        ["Negative Reviews", negative],
        ["Neutral Reviews", neutral],
    ]

    table = Table(data, colWidths=[250,120])

    table.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#1565C0")),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID",(0,0),(-1,-1),1,colors.grey),
        ("BACKGROUND",(0,1),(-1,-1),colors.whitesmoke),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("FONTNAME",(0,1),(-1,-1),"Helvetica"),
        ("BOTTOMPADDING",(0,0),(-1,0),10),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ]))

    story.append(table)

    story.append(Spacer(1,30))

    story.append(Paragraph("Sentiment Distribution", heading))

    drawing = Drawing(350,220)

    pie = Pie()

    pie.x = 60
    pie.y = 10
    pie.width = 170
    pie.height = 170

    pie.data = [positive, negative, neutral]

    pie.labels = [
        "Positive",
        "Negative",
        "Neutral"
    ]

    pie.slices[0].fillColor = colors.green
    pie.slices[1].fillColor = colors.red
    pie.slices[2].fillColor = colors.orange

    drawing.add(pie)

    story.append(drawing)

    story.append(Spacer(1,20))

    story.append(PageBreak())

    story.append(Paragraph("Weekly Footfall", heading))
    story.append(Spacer(1, 10))

    drawing = Drawing(420, 220)

    chart = HorizontalLineChart()
    chart.x = 40
    chart.y = 40
    chart.width = 340
    chart.height = 180

    chart.data = [footfall]

    # Dynamic weekday labels
    chart.categoryAxis.categoryNames = labels

    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = max(max(footfall), 1) + 2
    chart.valueAxis.valueStep = 1

    chart.lines[0].strokeColor = colors.HexColor("#1E88E5")
    chart.lines[0].strokeWidth = 2

    drawing.add(chart)

    story.append(drawing)

    story.append(Spacer(1,10))

    footer = styles["Italic"]

    footer.alignment = TA_CENTER

    footer.textColor = colors.grey

    story.append(
        Paragraph(
            "Generated by SmartRetail AI © 2026",
            footer
        )
    )

    from reportlab.pdfgen import canvas

    def add_metadata(canvas, doc):
        canvas.setTitle("SmartRetail AI Analytics Report")
        canvas.setAuthor("SmartRetail AI")
        canvas.setSubject("Retail Analytics Dashboard Report")
        canvas.setCreator("SmartRetail AI")

    doc.build(
        story,
        onFirstPage=add_metadata,
        onLaterPages=add_metadata
    )

    return FileResponse(
        pdf,
        filename="SmartRetail_Report.pdf",
        media_type="application/pdf"
    )