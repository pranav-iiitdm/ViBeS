from neo4j import GraphDatabase
import json

# Neo4j connection details
URI = "neo4j+s://69acfba4.databases.neo4j.io"  # Update with your Neo4j instance URI
AUTH = ("neo4j", "ZZciq7iG-3yfEby0pqoz6Hq6jbeUNcx_iciP-nzpZJA")   # Update with your credentials

# Load the JSON data
with open('/Users/venkatasai/Personal/ViBeS/website_data.json', 'r') as file:
    data = json.load(file)

# Initialize the Neo4j driver
driver = GraphDatabase.driver(URI, auth=AUTH)

def clear_database(tx):
    """Clear existing data in the database"""
    tx.run("MATCH (n) DETACH DELETE n")

def create_research_graph(tx, data):
    """Create the research graph from JSON data"""
    
    # First create all nodes
    for item in data:
        page_type = item["page"].split('/')[0] if '/' in item["page"] else item["page"]
        
        if page_type == "research":
            # Create Research nodes
            category = item.get("category", "")
            tx.run("""
                MERGE (r:Research {title: $title})
                SET r.abstract = $abstract,
                    r.authors = $authors,
                    r.dataset = $dataset,
                    r.github = $github,
                    r.date = $date,
                    r.category = $category
            """, 
            title=item["title"],
            abstract=item.get("abstract", ""),
            authors=item.get("authors", ""),
            dataset=item.get("Dataset", ""),
            github=item.get("GitHub", ""),
            date=item.get("date", ""),
            category=category)
            
            # Create Category node and connect to Research
            if category:
                tx.run("""
                    MERGE (c:Category {name: $category})
                    MERGE (r:Research {title: $title})
                    MERGE (r)-[:BELONGS_TO]->(c)
                """, 
                category=category,
                title=item["title"])
            
        elif page_type == "publications":
            # Create Publication nodes
            authors = item.get("authors", [])
            if isinstance(authors, str):
                authors = [authors]
                
            tx.run("""
                MERGE (p:Publication {title: $title})
                SET p.abstract = $abstract,
                    p.venue = $venue,
                    p.year = $year,
                    p.link = $link,
                    p.type = $type
            """, 
            title=item["title"],
            abstract=item.get("abstract", ""),
            venue=item.get("venue", ""),
            year=item.get("year", ""),
            link=item.get("link", ""),
            type=item.get("type", ""))
            
            # Create Author nodes and connect to Publication
            for author in authors:
                tx.run("""
                    MERGE (a:Author {name: $author})
                    MERGE (p:Publication {title: $title})
                    MERGE (a)-[:AUTHORED]->(p)
                """, 
                author=author.strip(),
                title=item["title"])
                
        elif page_type == "team":
            # Create Team Member nodes
            research_interests = item.get("researchInterests", [])
            tx.run("""
                MERGE (t:TeamMember {name: $name})
                SET t.role = $role,
                    t.bio = $bio,
                    t.googleScholarUrl = $googleScholarUrl,
                    t.researchGateUrl = $researchGateUrl,
                    t.linkedinUrl = $linkedinUrl,
                    t.additionalInfo = $additionalInfo
            """, 
            name=item["name"],
            role=item.get("role", ""),
            bio=item.get("bio", ""),
            googleScholarUrl=item.get("googleScholarUrl", ""),
            researchGateUrl=item.get("researchGateUrl", ""),
            linkedinUrl=item.get("linkedinUrl", ""),
            additionalInfo=item.get("additionalInfo", ""))
            
            # Create ResearchInterest nodes and connect to TeamMember
            for interest in research_interests:
                tx.run("""
                    MERGE (ri:ResearchInterest {name: $interest})
                    MERGE (t:TeamMember {name: $name})
                    MERGE (t)-[:HAS_INTEREST_IN]->(ri)
                """, 
                interest=interest,
                name=item["name"])
                
        elif page_type == "students":
            # Create Student nodes
            research_interests = item.get("researchInterests", [])
            projects = item.get("projects", [])
            
            tx.run("""
                MERGE (s:Student {name: $name})
                SET s.bio = $bio,
                    s.role = $role,
                    s.googleScholarUrl = $googleScholarUrl,
                    s.researchGateUrl = $researchGateUrl,
                    s.linkedinUrl = $linkedinUrl,
                    s.additionalInfo = $additionalInfo
            """, 
            name=item["name"],
            bio=item.get("bio", ""),
            role=item.get("role", ""),
            googleScholarUrl=item.get("googleScholarUrl", ""),
            researchGateUrl=item.get("researchGateUrl", ""),
            linkedinUrl=item.get("linkedinUrl", ""),
            additionalInfo=item.get("additionalInfo", ""))
            
            # Create ResearchInterest nodes and connect to Student
            for interest in research_interests:
                tx.run("""
                    MERGE (ri:ResearchInterest {name: $interest})
                    MERGE (s:Student {name: $name})
                    MERGE (s)-[:HAS_INTEREST_IN]->(ri)
                """, 
                interest=interest,
                name=item["name"])
                
            # Create Project nodes and connect to Student
            for project in projects:
                tx.run("""
                    MERGE (p:Project {title: $title})
                    SET p.description = $description
                    MERGE (s:Student {name: $name})
                    MERGE (s)-[:WORKED_ON]->(p)
                """, 
                title=project.get("title", ""),
                description=project.get("description", ""),
                name=item["name"])
    
    # Then create relationships between nodes
    for item in data:
        if "page" in item and "authors" in item:
            page_type = item["page"].split('/')[0] if '/' in item["page"] else item["page"]
            
            if page_type == "research":
                authors = item.get("authors", "")
                if isinstance(authors, str):
                    authors = [a.strip() for a in authors.split(",")]
                
                for author in authors:
                    # First ensure all nodes exist
                    tx.run("""
                        MERGE (r:Research {title: $title})
                        MERGE (a:Person {name: $author})
                        MERGE (a)-[:CONTRIBUTED_TO]->(r)
                    """, 
                    title=item["title"],
                    author=author)
                    
                    # Then try to connect to TeamMember if exists
                    tx.run("""
                        MATCH (r:Research {title: $title})
                        MATCH (tm:TeamMember {name: $author})
                        MERGE (tm)-[:CONTRIBUTED_TO]->(r)
                    """, 
                    title=item["title"],
                    author=author)
                    
                    # Then try to connect to Student if exists
                    tx.run("""
                        MATCH (r:Research {title: $title})
                        MATCH (s:Student {name: $author})
                        MERGE (s)-[:CONTRIBUTED_TO]->(r)
                    """, 
                    title=item["title"],
                    author=author)

# Execute the import
with driver.session() as session:
    print("Clearing existing database...")
    session.execute_write(clear_database)
    
    print("Creating research graph...")
    session.execute_write(create_research_graph, data)
    
    print("Import completed successfully!")

driver.close()